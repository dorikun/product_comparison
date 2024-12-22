import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import type { Product } from "./types";

export async function getProductsByCategory(category: string): Promise<Product[]> {
  console.log("Fetching products for category:", category);
  const productsRef = collection(db, "products");
  const q = query(productsRef, where("category", "==", category));
  
  try {
    const querySnapshot = await getDocs(q);
    console.log("Found products:", querySnapshot.size);
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    console.log("Processed products:", products);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("製品データの取得に失敗しました。しばらく経ってからもう一度お試しください。");
  }
}
