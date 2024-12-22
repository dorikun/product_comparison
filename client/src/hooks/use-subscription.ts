import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { useToast } from '@/components/ui/use-toast';

interface SubscriptionStatus {
  isPremium: boolean;
  isInTrialPeriod: boolean;
}

export function useSubscription() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: subscriptionStatus, isLoading } = useQuery<SubscriptionStatus>({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/subscription/status', {
          credentials: 'include'
        });

        if (!response.ok) {
          if (response.status === 401) {
            return { isPremium: false, isInTrialPeriod: false };
          }
          throw new Error('サブスクリプション状態の取得に失敗しました');
        }

        return response.json();
      } catch (error) {
        console.error('Error fetching subscription status:', error);
        throw error;
      }
    },
    enabled: !!user,
  });

  const createSubscription = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch('/api/subscription', {
          method: 'POST',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('サブスクリプションの作成に失敗しました');
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error creating subscription:', error);
        throw error;
      }
    },
  });

  const startTrial = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/subscription/trial', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('トライアルの開始に失敗しました');
      }

      return response.json();
    },
  });

  const subscribe = async () => {
    if (!user) {
      toast({
        title: "ログインが必要です",
        description: "プレミアム会員に登録するにはログインしてください。",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!isInTrialPeriod) {
        // トライアル開始
        await startTrial.mutateAsync();
        queryClient.invalidateQueries({ queryKey: ['subscription-status'] });
        toast({
          title: "トライアル開始",
          description: "3日間のトライアル期間が開始されました。",
        });
      } else {
        // プレミアム会員登録
        const result = await createSubscription.mutateAsync();
        if (result.url) {
          window.location.href = result.url;
        }
      }
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "操作に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  return {
    isPremium: subscriptionStatus?.isPremium ?? false,
    isInTrialPeriod: subscriptionStatus?.isInTrialPeriod ?? false,
    isLoading,
    subscribe,
    isSubscribing: createSubscription.isPending,
  };
}
