import { getSpecificationsForCategory } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Heart, Image, ShoppingCart, ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { Product } from "@/lib/types";
import { useFavorites } from "@/hooks/use-favorites";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ComparisonTableProps {
  products: Product[];
  category: string;
  selectedProducts?: string[];
  onProductSelect?: (productId: string) => void;
}

export default function ComparisonTable({ 
  products, 
  category, 
  selectedProducts = [], 
  onProductSelect 
}: ComparisonTableProps) {
  const specifications = getSpecificationsForCategory(category);
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [_, navigate] = useLocation();

  const getRadarData = (product: Product) => {
    switch (category) {
      case 'refrigerator':
        return [
          { subject: "価格", value: (1 - (product.price / 500000)) * 100 },
          { subject: "容量", value: parseInt(product.specifications["容量"]) / 600 * 100 },
          { subject: "省エネ", value: product.specifications["省エネ性能"].length * 20 },
          { subject: "製氷", value: product.specifications["製氷機能"].includes("急速") ? 100 : 80 },
          { subject: "機能性", value: product.features.length * 20 },
        ];
      case 'air-conditioner':
        return [
          { subject: "価格", value: (1 - (product.price / 300000)) * 100 },
          { subject: "冷房", value: parseFloat(product.specifications["冷房能力"]) / 3.0 * 100 },
          { subject: "暖房", value: parseFloat(product.specifications["暖房能力"]) / 4.0 * 100 },
          { subject: "省エネ", value: product.specifications["省エネ性能"].length * 20 },
          { subject: "機能性", value: product.features.length * 20 },
        ];
      case 'vacuum':
        return [
          { subject: "価格", value: (1 - (product.price / 100000)) * 100 },
          { subject: "吸引", value: parseInt(product.specifications["吸引力"]) / 200 * 100 },
          { subject: "静音", value: 100 - parseInt(product.specifications["運転音"]) },
          { subject: "容量", value: parseFloat(product.specifications["集塵容量"]) / 1.0 * 100 },
          { subject: "稼働", value: parseInt(product.specifications["バッテリー持続時間"]) / 60 * 100 },
        ];
      case 'washing-machine':
        return [
          { subject: "価格", value: (1 - (product.price / 400000)) * 100 },
          { subject: "容量", value: parseInt(product.specifications["洗濯容量"]) / 12 * 100 },
          { subject: "脱水", value: parseInt(product.specifications["脱水性能"]) / 1200 * 100 },
          { subject: "乾燥", value: product.specifications["乾燥機能"].includes("ヒートポンプ") ? 100 : 80 },
          { subject: "機能性", value: product.features.length * 20 },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className={`group rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50 ${
            selectedProducts.includes(product.id) ? "border-blue-500 bg-blue-50" : ""
          } ${onProductSelect ? "" : "hover:scale-[1.02] active:scale-[0.98]"}`}
          onClick={(e) => {
            if (onProductSelect) {
              onProductSelect(product.id);
            }
          }}
          style={{ cursor: onProductSelect ? 'pointer' : 'default' }}
        >
          <div className="relative">
            {onProductSelect && (
              <div className="absolute top-4 left-4 z-10">
                <Checkbox
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={() => onProductSelect(product.id)}
                />
              </div>
            )}
            <div className="absolute top-4 right-4 z-10">
              {user ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`transition-colors ${
                    isFavorite(product.id) ? "text-red-500" : "text-gray-400 hover:text-red-500"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation(); // イベントの伝播を停止
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
              ) : null}
            </div>
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">製品画像なし</span>
              </div>
            )}
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.manufacturer}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold mb-2">¥{product.price.toLocaleString()}</div>
              </div>
            </div>
            <div className="w-full h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={getRadarData(product)}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <Radar
                    name={product.name}
                    dataKey="value"
                    stroke="#2563eb"
                    fill="#2563eb"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
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
                <div className="text-sm text-muted-foreground mb-2">機能</div>
                <div className="flex flex-wrap gap-1">
                  {product.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 flex gap-2">
            <Button
              variant="default"
              size="sm"
              className="flex-1 group relative overflow-hidden transition-all hover:scale-105 active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/compare/${category}/${product.id}`);
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 transition-transform group-hover:translate-x-1">
                詳細を見る
                <ArrowLeft className="h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 z-0 bg-primary/10 transition-transform duration-300 group-hover:scale-x-100 scale-x-0 origin-left" />
            </Button>
            {product.amazonUrl && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(product.amazonUrl, '_blank');
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Amazonで見る
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
