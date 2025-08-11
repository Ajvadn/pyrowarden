import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Package, ShoppingCart, Settings, AlertTriangle, Activity } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';

interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
}

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && isAdmin) {
      fetchAdminData();
    }
  }, [user, isAdmin]);

  const fetchAdminData = async () => {
    try {
      // Fetch users count from profiles table (since auth.users is not directly accessible)
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Fetch orders data
      const { data: orders, count: ordersCount } = await supabase
        .from('orders')
        .select('total_amount, status', { count: 'exact' });

      // Calculate stats
      const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
      const revenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      setStats({
        totalUsers: usersCount || 0,
        totalProducts: productsCount || 0,
        totalOrders: ordersCount || 0,
        pendingOrders,
        revenue,
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }

    setLoading(false);
  };

  // Redirect if not admin
  if (!user || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">Loading admin panel...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEO title="Admin Panel - Pyrowarden" description="Administrative dashboard for managing the platform" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage users, products, and orders</p>
          </div>
          <Badge variant="default" className="text-sm px-3 py-1">
            Administrator
          </Badge>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                Total products
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingOrders} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.revenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Total revenue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Manage Users
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Management
              </CardTitle>
              <CardDescription>Add, edit, or remove products</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Manage Products
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Management
              </CardTitle>
              <CardDescription>View and process customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Manage Orders
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Status
            </CardTitle>
            <CardDescription>Monitor system health and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Database Connection</span>
                <Badge variant="default">Healthy</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Authentication Service</span>
                <Badge variant="default">Operational</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Payment Gateway</span>
                <Badge variant="default">Connected</Badge>
              </div>
              {stats.pendingOrders > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Pending Orders
                  </span>
                  <Badge variant="outline">{stats.pendingOrders} requires attention</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Back */}
        <div className="mt-8 text-center">
          <Link to="/dashboard" className="text-primary hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default Admin;