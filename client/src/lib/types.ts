export interface Product {
  id: string;
  name: string;
  manufacturer: string;
  price: number;
  category: string;
  specifications: Record<string, string>;  // すべての仕様値を文字列として扱う
  features: string[];
  amazonUrl?: string;
  imageUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}
