import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Heart, Package, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';

interface DashboardStats {
  totalOrders: number;
  totalSpent: number;
  cartItems: number;
  wishlistItems: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
}

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalSpent: 0,
    cartItems: 0,
    wishlistItems: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch order statistics
      const { data: orders } = await supabase
        .from('orders')
        .select('id, total_amount, status, order_number, created_at')
        .eq('user_id', user.id);

      // Fetch cart items count
      const { count: cartCount } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch wishlist items count
      const { count: wishlistCount } = await supabase
        .from('wishlist_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Calculate stats
      const totalOrders = orders?.length || 0;
      const totalSpent = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      setStats({
        totalOrders,
        totalSpent,
        cartItems: cartCount || 0,
        wishlistItems: wishlistCount || 0,
      });

      // Set recent orders (last 5)
      const recentOrdersData = orders
        ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5) || [];
      
      setRecentOrders(recentOrdersData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }

    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'default';
      case 'shipped': return 'secondary';
      case 'processing': return 'outline';
      case 'pending': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  if (!user) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please sign in to view your dashboard</h1>
            <Link to="/auth" className="text-primary hover:underline">
              Sign In
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
          <div className="text-center">Loading dashboard...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEO title="Dashboard - Pyrowarden" description="Your personal dashboard and account overview" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, manage your account and orders</p>
          </div>
          {isAdmin && (
            <Link to="/admin">
              <Badge className="text-sm px-3 py-1">Admin Panel</Badge>
            </Link>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cart Items</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cartItems}</div>
              <Link to="/cart" className="text-xs text-muted-foreground hover:text-primary">
                View cart
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.wishlistItems}</div>
              <Link to="/wishlist" className="text-xs text-muted-foreground hover:text-primary">
                View wishlist
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest order activity</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <Link to="/products" className="text-primary hover:underline">
                  Start shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Order #{order.order_number}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <span className="font-semibold">${order.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
                <div className="text-center pt-4">
                  <Link to="/profile" className="text-primary hover:underline">
                    View all orders
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Dashboard;