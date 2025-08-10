import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import PageLayout from '@/components/PageLayout';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  compare_price?: number;
  images: string[];
  category?: string;
  tags: string[];
  featured: boolean;
  stock_quantity: number;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleWishlistToggle = (productId: string) => {
    if (isInWishlist(productId)) {
      const wishlistItem = products.find(p => p.id === productId);
      if (wishlistItem) {
        removeFromWishlist(productId);
      }
    } else {
      addToWishlist(productId);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">Loading products...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our collection of premium cybersecurity tools and hardware
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    {product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                    {product.featured && (
                      <Badge className="absolute top-2 left-2">Featured</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                      onClick={() => handleWishlistToggle(product.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2">
                    <Link 
                      to={`/product/${product.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {product.name}
                    </Link>
                  </CardTitle>
                  {product.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold">${product.price}</span>
                    {product.compare_price && product.compare_price > product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.compare_price}
                      </span>
                    )}
                  </div>
                  {product.category && (
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full" 
                    onClick={() => addToCart(product.id)}
                    disabled={product.stock_quantity === 0}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Products;