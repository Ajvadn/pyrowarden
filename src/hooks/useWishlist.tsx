import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface WishlistItem {
  id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    compare_price?: number;
  };
}

export const useWishlist = () => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        id,
        product_id,
        product:products(id, name, price, images, compare_price)
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching wishlist:', error);
    } else {
      setWishlistItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const addToWishlist = async (productId: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to wishlist",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: user.id,
        product_id: productId
      });

    if (error) {
      if (error.code === '23505') {
        toast({
          title: "Already in wishlist",
          description: "This item is already in your wishlist"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add item to wishlist",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Added to wishlist",
        description: "Item has been added to your wishlist"
      });
      fetchWishlist();
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist"
      });
      fetchWishlist();
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  return {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    fetchWishlist
  };
};