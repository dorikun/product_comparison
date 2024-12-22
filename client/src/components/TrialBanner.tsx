import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle } from "lucide-react";

export default function TrialBanner() {
  const { isInTrialPeriod, subscribe, isSubscribing } = useSubscription();

  if (!isInTrialPeriod) return null;

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Clock className="h-5 w-5 text-blue-400" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between items-center">
          <p className="text-sm text-blue-700">
            プレミアム機能を3日間無料でお試しいただけます。トライアル期間中はすべての機能をご利用いただけます。
          </p>
          <div className="mt-3 md:mt-0 md:ml-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => subscribe()}
              disabled={isSubscribing}
              className="text-blue-700 hover:bg-blue-100"
            >
              {isSubscribing ? (
                "処理中..."
              ) : (
                <>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  プレミアムに登録
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
