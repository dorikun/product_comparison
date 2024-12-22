import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getSpecificationsForCategory } from "@/lib/data";
import type { Product } from "@/lib/types";

interface FilterPanelProps {
  filters: {
    priceRange: number[];
    manufacturer: string[];
    energyRating: string[];
    features: string[];
    specifications: Record<string, string[]>;
  };
  setFilters: (filters: FilterPanelProps["filters"]) => void;
  products: Product[];
  category: string;
}

export default function FilterPanel({ filters, setFilters, products, category }: FilterPanelProps) {
  const manufacturers = Array.from(new Set(products.map(p => p.manufacturer))).filter(Boolean);
  const maxPrice = Math.max(...products.map(p => p.price), 0);
  const minPrice = Math.min(...products.map(p => p.price), maxPrice);
  const energyRatings = Array.from(new Set(products.map(p => p.specifications?.["省エネ性能"] || ""))).filter(Boolean).sort();
  const allFeatures = Array.from(new Set(products.flatMap(p => p.features || []))).filter(Boolean);
  
  const specifications = getSpecificationsForCategory(category);

  const resetFilters = () => {
    setFilters({
      priceRange: [minPrice, maxPrice],
      manufacturer: [],
      energyRating: [],
      features: [],
      specifications: specifications.reduce((acc, spec) => {
        acc[spec] = [];
        return acc;
      }, {} as Record<string, string[]>)
    });
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>フィルター</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="text-xs"
        >
          リセット
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 価格帯フィルター */}
        <div className="space-y-4">
          <Label>価格帯</Label>
          <div className="space-y-6">
            <div className="relative pt-1">
              <Slider
                min={0}
                max={maxPrice}
                step={10000}
                value={filters.priceRange}
                onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
                className="relative z-10"
              />
            </div>
            <div className="flex justify-between items-start">
              <div className="text-center">
                <Label className="text-xs text-muted-foreground block">最小価格</Label>
                <div className="text-sm font-medium mt-1">¥{filters.priceRange[0].toLocaleString()}</div>
              </div>
              <div className="text-center">
                <Label className="text-xs text-muted-foreground block">最大価格</Label>
                <div className="text-sm font-medium mt-1">¥{filters.priceRange[1].toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 省エネ性能フィルター */}
        {energyRatings.length > 0 && (
          <div className="space-y-4">
            <Label>省エネ性能</Label>
            <div className="space-y-2">
              {energyRatings.map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`energy-${rating}`}
                    checked={filters.energyRating.includes(rating)}
                    onCheckedChange={(checked) => {
                      const newRatings = checked
                        ? [...filters.energyRating, rating]
                        : filters.energyRating.filter(r => r !== rating);
                      setFilters({ ...filters, energyRating: newRatings });
                    }}
                  />
                  <Label htmlFor={`energy-${rating}`} className="flex items-center gap-2">
                    {rating}
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      eco
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* メーカーフィルター */}
        <div className="space-y-4">
          <Label>メーカー</Label>
          <div className="space-y-2">
            {manufacturers.map((manufacturer) => (
              <div key={manufacturer} className="flex items-center space-x-2">
                <Checkbox
                  id={manufacturer}
                  checked={filters.manufacturer.includes(manufacturer)}
                  onCheckedChange={(checked) => {
                    const newManufacturers = checked
                      ? [...filters.manufacturer, manufacturer]
                      : filters.manufacturer.filter(m => m !== manufacturer);
                    setFilters({ ...filters, manufacturer: newManufacturers });
                  }}
                />
                <Label htmlFor={manufacturer}>{manufacturer}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* 特徴フィルター */}
        <div className="space-y-4">
          <Label>特徴</Label>
          <div className="space-y-2">
            {allFeatures.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={`feature-${feature}`}
                  checked={filters.features.includes(feature)}
                  onCheckedChange={(checked) => {
                    const newFeatures = checked
                      ? [...filters.features, feature]
                      : filters.features.filter(f => f !== feature);
                    setFilters({ ...filters, features: newFeatures });
                  }}
                />
                <Label htmlFor={`feature-${feature}`}>{feature}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* 仕様フィルター */}
        {specifications.map((spec) => {
          if (spec === "容量") {
            return (
              <div key={spec} className="space-y-4">
                <Label>{spec}</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="capacity-small"
                      checked={filters.specifications[spec]?.includes("~400L")}
                      onCheckedChange={(checked) => {
                        const newSpecValues = checked
                          ? [...(filters.specifications[spec] || []), "~400L"]
                          : (filters.specifications[spec] || []).filter(v => v !== "~400L");
                        setFilters({
                          ...filters,
                          specifications: {
                            ...filters.specifications,
                            [spec]: newSpecValues
                          }
                        });
                      }}
                    />
                    <Label htmlFor="capacity-small">
                      1~2人向け
                      <span className="ml-2 text-xs text-muted-foreground">(〜400L)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="capacity-medium"
                      checked={filters.specifications[spec]?.includes("401L~500L")}
                      onCheckedChange={(checked) => {
                        const newSpecValues = checked
                          ? [...(filters.specifications[spec] || []), "401L~500L"]
                          : (filters.specifications[spec] || []).filter(v => v !== "401L~500L");
                        setFilters({
                          ...filters,
                          specifications: {
                            ...filters.specifications,
                            [spec]: newSpecValues
                          }
                        });
                      }}
                    />
                    <Label htmlFor="capacity-medium">
                      3~4人向け
                      <span className="ml-2 text-xs text-muted-foreground">(401L〜500L)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="capacity-large"
                      checked={filters.specifications[spec]?.includes("501L~")}
                      onCheckedChange={(checked) => {
                        const newSpecValues = checked
                          ? [...(filters.specifications[spec] || []), "501L~"]
                          : (filters.specifications[spec] || []).filter(v => v !== "501L~");
                        setFilters({
                          ...filters,
                          specifications: {
                            ...filters.specifications,
                            [spec]: newSpecValues
                          }
                        });
                      }}
                    />
                    <Label htmlFor="capacity-large">
                      5人以上向け
                      <span className="ml-2 text-xs text-muted-foreground">(501L以上)</span>
                    </Label>
                  </div>
                </div>
              </div>
            );
          }

          // 掃除機の場合の特別な処理
          if (category === 'vacuum') {
            if (spec === '吸引力') {
              return (
                <div key={spec} className="space-y-4">
                  <Label>{spec}</Label>
                  <div className="space-y-2">
                    {[
                      { value: "~100", label: "標準" },
                      { value: "101~150", label: "パワフル" },
                      { value: "151~", label: "ハイパワー" }
                    ].map(({ value, label }) => (
                      <div key={`${spec}-${value}`} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${spec}-${value}`}
                          checked={filters.specifications[spec]?.includes(value)}
                          onCheckedChange={(checked) => {
                            const newSpecValues = checked
                              ? [...(filters.specifications[spec] || []), value]
                              : (filters.specifications[spec] || []).filter(v => v !== value);
                            setFilters({
                              ...filters,
                              specifications: {
                                ...filters.specifications,
                                [spec]: newSpecValues
                              }
                            });
                          }}
                        />
                        <Label htmlFor={`${spec}-${value}`}>
                          {label}
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({value === "~100" ? "〜100W" : value === "101~150" ? "101W〜150W" : "151W以上"})
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            } else if (spec === '運転音') {
              return (
                <div key={spec} className="space-y-4">
                  <Label>{spec}</Label>
                  <div className="space-y-2">
                    {[
                      { value: "~60", label: "静音" },
                      { value: "61~70", label: "標準" },
                      { value: "71~", label: "やや大きめ" }
                    ].map(({ value, label }) => (
                      <div key={`${spec}-${value}`} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${spec}-${value}`}
                          checked={filters.specifications[spec]?.includes(value)}
                          onCheckedChange={(checked) => {
                            const newSpecValues = checked
                              ? [...(filters.specifications[spec] || []), value]
                              : (filters.specifications[spec] || []).filter(v => v !== value);
                            setFilters({
                              ...filters,
                              specifications: {
                                ...filters.specifications,
                                [spec]: newSpecValues
                              }
                            });
                          }}
                        />
                        <Label htmlFor={`${spec}-${value}`}>
                          {label}
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({value === "~60" ? "〜60dB" : value === "61~70" ? "61〜70dB" : "71dB以上"})
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            } else if (spec === 'バッテリー持続時間') {
              return (
                <div key={spec} className="space-y-4">
                  <Label>{spec}</Label>
                  <div className="space-y-2">
                    {[
                      { value: "~30", label: "短時間使用向け" },
                      { value: "31~60", label: "標準的な使用向け" },
                      { value: "61~", label: "長時間使用向け" }
                    ].map(({ value, label }) => (
                      <div key={`${spec}-${value}`} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${spec}-${value}`}
                          checked={filters.specifications[spec]?.includes(value)}
                          onCheckedChange={(checked) => {
                            const newSpecValues = checked
                              ? [...(filters.specifications[spec] || []), value]
                              : (filters.specifications[spec] || []).filter(v => v !== value);
                            setFilters({
                              ...filters,
                              specifications: {
                                ...filters.specifications,
                                [spec]: newSpecValues
                              }
                            });
                          }}
                        />
                        <Label htmlFor={`${spec}-${value}`}>
                          {label}
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({value === "~30" ? "〜30分" : value === "31~60" ? "31〜60分" : "61分以上"})
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          }

          // その他の仕様の場合は通常の処理
          const specValues = Array.from(
            new Set(products.map(p => String(p.specifications?.[spec] || "")))
          ).filter(Boolean);

          if (specValues.length === 0) return null;

          return (
            <div key={spec} className="space-y-4">
              <Label>{spec}</Label>
              <div className="space-y-2">
                {specValues.map((value) => (
                  <div key={`${spec}-${value}`} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${spec}-${value}`}
                      checked={filters.specifications[spec]?.includes(value)}
                      onCheckedChange={(checked) => {
                        const newSpecValues = checked
                          ? [...(filters.specifications[spec] || []), value]
                          : (filters.specifications[spec] || []).filter(v => v !== value);
                        setFilters({
                          ...filters,
                          specifications: {
                            ...filters.specifications,
                            [spec]: newSpecValues
                          }
                        });
                      }}
                    />
                    <Label htmlFor={`${spec}-${value}`}>{value}</Label>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
