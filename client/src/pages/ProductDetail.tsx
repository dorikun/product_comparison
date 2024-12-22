import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import { getSpecificationsForCategory } from "@/lib/data";
import { useAuth } from "@/hooks/use-auth";
import { useFavorites } from "@/hooks/use-favorites";
import { getProductsByCategory } from "@/lib/api";

export default function ProductDetail() {
  const { category, id } = useParams();
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  console.log("Category:", category, "ID:", id); // デバッグ用

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      const result = await getProductsByCategory(category || '');
      console.log("Fetched products:", result); // デバッグ用
      return result;
    },
    enabled: !!category,
  });

  const product = products.find(p => p.id === id);
  console.log("Looking for product with id:", id);
  console.log("Found product:", product);

  const specifications = getSpecificationsForCategory(category || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(`/compare/${category}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">
              製品が見つかりません
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(`/compare/${category}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          戻る
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 製品画像 */}
          <div>
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full aspect-square object-cover rounded-lg"
              />
            ) : (
              <div className="w-full aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      const response = await fetch(`/api/products/${product.id}/generate-image`, {
                        method: 'POST',
                      });
                      if (!response.ok) throw new Error('画像の生成に失敗しました');
                      const data = await response.json();
                      window.location.reload();
                    } catch (error) {
                      console.error('Error generating image:', error);
                    }
                  }}
                >
                  画像を生成
                </Button>
                <span className="text-gray-400 text-xs">画像なし</span>
              </div>
            )}
          </div>

          {/* 製品情報 */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-xl text-muted-foreground">{product.manufacturer}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                ¥{product.price.toLocaleString()}
              </div>
              <div className="flex gap-2">
                {user && (
                  <Button
                    variant="outline"
                    size="icon"
                    className={`transition-colors ${
                      isFavorite(product.id) ? "text-red-500" : "text-gray-400 hover:text-red-500"
                    }`}
                    onClick={() => {
                      if (isFavorite(product.id)) {
                        removeFavorite(product.id);
                      } else {
                        addFavorite(product);
                      }
                    }}
                  >
                    <Heart
                      className="h-5 w-5"
                      fill={isFavorite(product.id) ? "currentColor" : "none"}
                    />
                  </Button>
                )}
                {product.amazonUrl && (
                  <Button
                    onClick={() => window.open(product.amazonUrl, '_blank')}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Amazonで購入
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {specifications.map((spec) => (
                <div key={spec} className="space-y-1">
                  <div className="text-sm text-muted-foreground">{spec}</div>
                  <div className="font-medium">
                    {product.specifications[spec]}
                    {spec === "省エネ性能" && (
                      <span className="ml-2 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        eco
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">機能</h2>
              <div className="flex flex-wrap gap-2">
                {product.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
