import { useState, useEffect } from "react";
import { useAuth } from "./use-auth";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/lib/types";

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // お気に入り一覧を取得
  useEffect(() => {
    async function fetchFavorites() {
      if (!user) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      try {
        const favoritesRef = collection(db, "favorites");
        const q = query(favoritesRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const favoriteIds = querySnapshot.docs.map(doc => doc.data().productId);
        setFavorites(favoriteIds);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [user]);

  // お気に入りに追加
  const addFavorite = async (product: Product) => {
    if (!user) return;

    try {
      const favoritesRef = collection(db, "favorites");
      await addDoc(favoritesRef, {
        userId: user.uid,
        productId: product.id,
        createdAt: new Date(),
      });
      setFavorites(prev => [...prev, product.id]);
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  };

  // お気に入りから削除
  const removeFavorite = async (productId: string) => {
    if (!user) return;

    try {
      const favoritesRef = collection(db, "favorites");
      const q = query(
        favoritesRef,
        where("userId", "==", user.uid),
        where("productId", "==", productId)
      );
      const querySnapshot = await getDocs(q);
      
      const deletePromises = querySnapshot.docs.map(doc =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);
      
      setFavorites(prev => prev.filter(id => id !== productId));
    } catch (error) {
      console.error("Error removing favorite:", error);
      throw error;
    }
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}
