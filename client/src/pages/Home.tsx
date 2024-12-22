import CategoryCard from "@/components/CategoryCard";
import { categories } from "@/lib/data";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-2">家電比較ツール</h1>
        <p className="text-center text-muted-foreground mb-12">
          最適な家電製品を見つけましょう
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}
        </div>
      </div>
    </div>
  );
}
