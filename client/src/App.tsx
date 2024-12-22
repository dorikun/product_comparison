import { Switch, Route } from "wouter";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AuthProvider } from "@/hooks/use-auth";
import Home from "./pages/Home";
import ProductComparison from "./pages/ProductComparison";
import ProductDetail from "./pages/ProductDetail";
import Favorites from "./pages/Favorites";

import Header from "./components/Header";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/compare/:category" component={ProductComparison} />
          <Route path="/compare/:category/:id" component={ProductDetail} />
          <Route path="/favorites" component={Favorites} />
          
          <Route component={NotFound} />
        </Switch>
      </div>
    </AuthProvider>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            ページが見つかりませんでした。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
