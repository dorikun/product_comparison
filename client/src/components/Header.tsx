import { Link } from "wouter";
import { Heart } from "lucide-react";
import UserMenu from "./UserMenu";
import { useAuth } from "@/hooks/use-auth";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="text-xl font-bold">家電比較ツール</a>
        </Link>
        <div className="flex items-center gap-4">
          {user && (
            <Link href="/favorites">
              <a className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Heart className="h-4 w-4" />
                お気に入り
              </a>
            </Link>
          )}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
