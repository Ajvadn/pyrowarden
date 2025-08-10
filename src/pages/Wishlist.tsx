import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Heart, ShoppingCart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <PageLayout>
        <SEO title="Wishlist - Pyrowarden" description="View your wishlist items" />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-4">Please sign in to view your wishlist</h1>
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">Loading wishlist...</div>
        </div>
      </PageLayout>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <PageLayout>
        <SEO title="Wishlist - Pyrowarden" description="Your wishlist is empty" />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-4">Your wishlist is empty</h1>
            <p className="text-muted-foreground mb-6">
              Add products to your wishlist to see them here
            </p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEO title="Wishlist - Pyrowarden" description="Your saved products and wishlist items" />
      
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow">
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                {item.product.images.length > 0 ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                </Button>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">
                  <Link 
                    to={`/product/${item.product.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {item.product.name}
                  </Link>
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">${item.product.price}</span>
                  {item.product.compare_price && item.product.compare_price > item.product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${item.product.compare_price}
                    </span>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full" 
                  onClick={() => addToCart(item.product.id)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Wishlist;