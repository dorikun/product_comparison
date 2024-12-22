import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useFavorites } from "@/hooks/use-favorites";
import ComparisonTable from "@/components/ComparisonTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { getProductsByCategory } from "@/lib/api";
import type { Product } from "@/lib/types";

export default function Favorites() {
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const { favorites, loading: favoritesLoading } = useFavorites();

  // カテゴリーごとの製品データを取得
  const { data: allProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ['all-products'],
    queryFn: async () => {
      const categories = ['refrigerator', 'air-conditioner', 'vacuum', 'washing-machine'];
      const products = await Promise.all(
        categories.map(async (category) => {
          return getProductsByCategory(category);
        })
      );
      return products.flat();
    },
  });

  const favoriteProducts = (allProducts as Product[]).filter(
    product => favorites.includes(product.id)
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">お気に入り</h1>
            <p className="text-muted-foreground">
              お気に入り機能を使用するにはログインが必要です
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isLoading = favoritesLoading || productsLoading;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          戻る
        </Button>

        <h1 className="text-3xl font-bold mb-2">お気に入り</h1>
        <p className="text-muted-foreground mb-8">
          お気に入りに登録した製品の一覧
        </p>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">読み込み中...</p>
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              お気に入りに登録された製品はありません
            </p>
          </div>
        ) : (
          <ComparisonTable products={favoriteProducts} category="favorites" />
        )}
      </div>
    </div>
  );
}
