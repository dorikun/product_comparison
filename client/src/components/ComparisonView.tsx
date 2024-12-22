import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSpecificationsForCategory } from "@/lib/data";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import ProductRadarChart from "./ProductRadarChart";

interface ComparisonViewProps {
  products: Product[];
  category: string;
}

export default function ComparisonView({ products, category }: ComparisonViewProps) {
  const specifications = getSpecificationsForCategory(category);

  if (products.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        比較する製品を選択してください
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ProductRadarChart products={products} category={category} />
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead>項目</TableHead>
              {products.map((product) => (
                <TableHead key={product.id} className="text-center">
                  <div className="flex flex-col items-center gap-2">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    )}
                    <div className="text-center">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {product.manufacturer}
                      </div>
                    </div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">価格</TableCell>
              {products.map((product) => (
                <TableCell key={product.id} className="text-center">
                  <div className="font-medium text-lg">¥{product.price.toLocaleString()}</div>
                  {product.amazonUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(product.amazonUrl, '_blank')}
                      className="mt-2"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Amazonで見る
                    </Button>
                  )}
                </TableCell>
              ))}
            </TableRow>
            {specifications.map((spec) => (
              <TableRow key={spec}>
                <TableCell className="font-medium">{spec}</TableCell>
                {products.map((product) => (
                  <TableCell key={product.id} className="text-center">
                    <div className="whitespace-nowrap font-medium">
                      {product.specifications[spec]}
                      {spec === "省エネ性能" && (
                        <span className="ml-2 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          eco
                        </span>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="font-medium">機能</TableCell>
              {products.map((product) => (
                <TableCell key={product.id}>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {product.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}