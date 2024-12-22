import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ComparisonTable from "@/components/ComparisonTable";
import FilterPanel from "@/components/FilterPanel";
import ComparisonView from "@/components/ComparisonView";
import { categories, getSpecificationsForCategory } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { getProductsByCategory } from "@/lib/api";
import type { Product } from "@/lib/types";

export default function ProductComparison() {
  const { category } = useParams();
  const [_, navigate] = useLocation();
  const [filters, setFilters] = useState({
    priceRange: [0, 300000],
    manufacturer: [] as string[],
    energyRating: [] as string[],
    features: [] as string[],
    specifications: {} as Record<string, string[]>,
  });
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // フィルターの初期化
  useEffect(() => {
    const specs = getSpecificationsForCategory(category || '');
    const initialSpecifications = specs.reduce((acc, spec) => {
      acc[spec] = [];
      return acc;
    }, {} as Record<string, string[]>);
    
    setFilters(prev => ({
      ...prev,
      specifications: initialSpecifications
    }));
  }, [category]);

  const categoryInfo = categories.find(c => c.id === category);
  const { data: categoryProducts = [], error, isError } = useQuery({
    queryKey: ['products', category],
    queryFn: () => getProductsByCategory(category || ''),
    enabled: !!category,
  });

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" className="mb-6" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">エラーが発生しました</h1>
            <p className="text-gray-600">{error instanceof Error ? error.message : "データの取得に失敗しました"}</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredProducts = (categoryProducts as Product[])
    .filter((product) => {
      const priceMatch =
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1];

      const manufacturerMatch =
        filters.manufacturer.length === 0 ||
        filters.manufacturer.includes(product.manufacturer);

      const energyRatingMatch =
        filters.energyRating.length === 0 ||
        filters.energyRating.includes(product.specifications?.["省エネ性能"] || "");

      const featuresMatch =
        filters.features.length === 0 ||
        filters.features.every(feature => product.features?.includes(feature));

      const specificationsMatch = Object.entries(filters.specifications).every(
        ([spec, values]) => {
          if (values.length === 0) return true;
          
          if (spec === "容量") {
            const capacity = parseInt(product.specifications[spec]);
            return values.some(range => {
              if (range === "~400L") return capacity <= 400;
              if (range === "401L~500L") return capacity > 400 && capacity <= 500;
              if (range === "501L~") return capacity > 500;
              return false;
            });
          }
          
          return values.includes(product.specifications?.[spec] || "");
        }
      );

      return (
        priceMatch &&
        manufacturerMatch &&
        energyRatingMatch &&
        featuresMatch &&
        specificationsMatch
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });

  if (!categoryInfo) {
    return <div>カテゴリーが見つかりません</div>;
  }

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

        <h1 className="text-3xl font-bold mb-2">{categoryInfo.name}の比較</h1>
        <p className="text-muted-foreground mb-8">
          以下の製品から最適な{categoryInfo.name}を見つけましょう
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              products={categoryProducts}
              category={category || ""}
            />
          </div>
          <div className="lg:col-span-3">
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      {selectedProducts.length === 0 
                        ? "製品を選択して比較できます" 
                        : `${selectedProducts.length}個の製品を比較中`}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    >
                      価格: {sortOrder === 'asc' ? '安い順' : '高い順'}
                    </Button>
                  </div>
                  {selectedProducts.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProducts([])}
                    >
                      選択解除
                    </Button>
                  )}
                </div>
                <ComparisonTable
                  products={filteredProducts}
                  category={category || ""}
                  selectedProducts={selectedProducts}
                  onProductSelect={(productId) => {
                    setSelectedProducts(prev =>
                      prev.includes(productId)
                        ? prev.filter(id => id !== productId)
                        : [...prev, productId]
                    );
                  }}
                />
              </div>

              {selectedProducts.length > 0 && (
                <div id="comparison-view">
                  <h2 className="text-lg font-semibold mb-4">製品比較</h2>
                  <ComparisonView
                    products={filteredProducts.filter(p => selectedProducts.includes(p.id))}
                    category={category || ""}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* フローティング比較ボタン */}
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-8 right-8">
          <Button
            size="lg"
            onClick={() => {
              document.getElementById('comparison-view')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }}
            className="shadow-lg"
          >
            <span className="mr-2">{selectedProducts.length}個の製品を比較</span>
            <ArrowLeft className="rotate-180 w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}