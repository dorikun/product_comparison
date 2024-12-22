import * as React from "react";
import type { ToasterToast } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterType = {
  toasts: ToasterToast[];
  addToast: (toast: ToasterToast) => void;
  removeToast: (toastId: string) => void;
  updateToast: (toastId: string, toast: ToasterToast) => void;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type ActionType = {
  type: typeof actionTypes[keyof typeof actionTypes];
  toast?: ToasterToast;
  toastId?: string;
};

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: ToasterToast[], action: ActionType) => {
  switch (action.type) {
    case "ADD_TOAST":
      if (!action.toast) return state;
      return [action.toast, ...state].slice(0, TOAST_LIMIT);

    case "UPDATE_TOAST":
      if (!action.toast) return state;
      return state.map((t) =>
        t.id === action.toastId ? { ...t, ...action.toast } : t
      );

    case "DISMISS_TOAST": {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      }
      return state.map((t) =>
        t.id === toastId || toastId === undefined
          ? {
              ...t,
              open: false,
            }
          : t
      );
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return [];
      }
      return state.filter((t) => t.id !== action.toastId);

    default:
      return state;
  }
};

const listeners: Array<(state: ToasterToast[]) => void> = [];

let memoryState: ToasterToast[] = [];

function dispatch(action: ActionType) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, "id" | "open">;

function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: Toast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toastId: id,
      toast: { ...props, id, open: true },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<ToasterToast[]>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
    toasts: state,
  };
}

export { useToast, toast };
