import { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from 'recharts';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ProductRadarChartProps {
  products: Product[];
  category: string;
}

type MetricConfig = {
  name: string;
  key: string;
  getValue: (product: Product) => number;
};

export default function ProductRadarChart({ products, category }: ProductRadarChartProps) {
  // カテゴリーごとの評価軸の定義
  const getAvailableMetrics = (): MetricConfig[] => {
    switch (category) {
      case 'refrigerator':
        return [
          { 
            name: '価格', 
            key: 'price',
            getValue: (p) => (1 - (p.price / 500000)) * 100 
          },
          { 
            name: '容量', 
            key: 'capacity',
            getValue: (p) => parseInt(p.specifications['容量']) / 600 * 100 
          },
          { 
            name: '省エネ', 
            key: 'energy',
            getValue: (p) => p.specifications['省エネ性能'].length * 20 
          },
          { 
            name: '製氷', 
            key: 'ice',
            getValue: (p) => p.specifications['製氷機能'].includes('急速') ? 100 : 80 
          },
          { 
            name: '機能性', 
            key: 'features',
            getValue: (p) => p.features.length * 20 
          },
        ];
      case 'air-conditioner':
        return [
          { 
            name: '価格', 
            key: 'price',
            getValue: (p) => (1 - (p.price / 300000)) * 100 
          },
          { 
            name: '冷房', 
            key: 'cooling',
            getValue: (p) => parseFloat(p.specifications['冷房能力']) / 3.0 * 100 
          },
          { 
            name: '暖房', 
            key: 'heating',
            getValue: (p) => parseFloat(p.specifications['暖房能力']) / 4.0 * 100 
          },
          { 
            name: '省エネ', 
            key: 'energy',
            getValue: (p) => p.specifications['省エネ性能'].length * 20 
          },
          { 
            name: '機能性', 
            key: 'features',
            getValue: (p) => p.features.length * 20 
          },
        ];
      case 'vacuum':
        return [
          { 
            name: '価格', 
            key: 'price',
            getValue: (p) => (1 - (p.price / 100000)) * 100 
          },
          { 
            name: '吸引', 
            key: 'suction',
            getValue: (p) => parseInt(p.specifications['吸引力']) / 200 * 100 
          },
          { 
            name: '静音', 
            key: 'noise',
            getValue: (p) => 100 - parseInt(p.specifications['運転音']) 
          },
          { 
            name: '容量', 
            key: 'capacity',
            getValue: (p) => parseFloat(p.specifications['集塵容量']) / 1.0 * 100 
          },
          { 
            name: '稼働', 
            key: 'runtime',
            getValue: (p) => parseInt(p.specifications['バッテリー持続時間']) / 60 * 100 
          },
        ];
      case 'washing-machine':
        return [
          { 
            name: '価格', 
            key: 'price',
            getValue: (p) => (1 - (p.price / 400000)) * 100 
          },
          { 
            name: '容量', 
            key: 'capacity',
            getValue: (p) => parseInt(p.specifications['洗濯容量']) / 12 * 100 
          },
          { 
            name: '脱水', 
            key: 'spin',
            getValue: (p) => parseInt(p.specifications['脱水性能']) / 1200 * 100 
          },
          { 
            name: '乾燥', 
            key: 'drying',
            getValue: (p) => p.specifications['乾燥機能'].includes('ヒートポンプ') ? 100 : 80 
          },
          { 
            name: '機能性', 
            key: 'features',
            getValue: (p) => p.features.length * 20 
          },
        ];
      default:
        return [];
    }
  };

  const availableMetrics = getAvailableMetrics();
  const [selectedMetrics, setSelectedMetrics] = useState(
    availableMetrics.slice(0, 5).map(m => m.key)
  );

  // チャート用のデータを整形
  const chartData = products[0] ? availableMetrics
    .filter(metric => selectedMetrics.includes(metric.key))
    .map(metric => ({
      subject: metric.name,
      ...products.reduce((acc, product, index) => {
        acc[`製品${index + 1}`] = metric.getValue(product);
        return acc;
      }, {}),
    })) : [];

  const colors = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04'];

  if (products.length === 0) return null;

  const handleToggleMetric = (key: string) => {
    setSelectedMetrics(prev => {
      if (prev.includes(key)) {
        // 最低3つは選択されている必要がある
        if (prev.length <= 3) return prev;
        return prev.filter(k => k !== key);
      } else {
        // 最大5つまでしか選択できない
        if (prev.length >= 5) return prev;
        return [...prev, key];
      }
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-2">
          <div className="font-medium">比較する項目を選択</div>
          <div className="text-sm text-muted-foreground mb-2">
            3〜5個の項目を選択できます
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {availableMetrics.map((metric) => (
              <div key={metric.key} className="flex items-center space-x-2">
                <Checkbox
                  id={metric.key}
                  checked={selectedMetrics.includes(metric.key)}
                  onCheckedChange={() => handleToggleMetric(metric.key)}
                  disabled={
                    !selectedMetrics.includes(metric.key) && selectedMetrics.length >= 5 ||
                    selectedMetrics.includes(metric.key) && selectedMetrics.length <= 3
                  }
                />
                <Label htmlFor={metric.key}>{metric.name}</Label>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="w-full aspect-square max-w-xl mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            {products.map((product, index) => (
              <Radar
                key={product.id}
                name={product.name}
                dataKey={`製品${index + 1}`}
                stroke={colors[index]}
                fill={colors[index]}
                fillOpacity={0.3}
              />
            ))}
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
