import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Internships from "./pages/Internships";
import DevelopmentProcess from "./pages/DevelopmentProcess";
import TechDetails from "./pages/TechDetails";
import FireCatProject from "./pages/FireCatProject";
import WorkwearProject from "./pages/WorkwearProject";
import HockeyProject from "./pages/HockeyProject";
import PetProject from "./pages/PetProject";
import SportRetailProject from "./pages/SportRetailProject";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Auth from "./pages/Auth";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/internships" element={<Internships />} />
              <Route path="/process" element={<DevelopmentProcess />} />
              <Route path="/tech-details" element={<TechDetails />} />
              <Route path="/firecat" element={<FireCatProject />} />
              <Route path="/workwear" element={<WorkwearProject />} />
              <Route path="/hockey" element={<HockeyProject />} />
              <Route path="/pet" element={<PetProject />} />
              <Route path="/sport-retail" element={<SportRetailProject />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;