import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
}

export default function CategoryCard({ id, name, description, image }: CategoryCardProps) {
  return (
    <Link href={`/compare/${id}`}>
      <Card className="cursor-pointer transition-transform hover:scale-105">
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-2">{name}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
