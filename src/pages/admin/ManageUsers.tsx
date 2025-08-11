import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Users, Search, UserPlus, Edit, Trash2, Shield, User, Crown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

const ManageUsers = () => {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    role: 'user'
  });

  useEffect(() => {
    if (user && isAdmin) {
      fetchUsers();
    }
  }, [user, isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  const handleEditUser = (user: UserProfile) => {
    setEditingUser(user);
    setFormData({
      full_name: user.full_name || '',
      phone: user.phone || '',
      role: user.role
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
        role: formData.role
      })
      .eq('id', editingUser.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "User updated successfully"
      });
      setIsEditDialogOpen(false);
      setEditingUser(null);
      fetchUsers();
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "User deleted successfully"
      });
      fetchUsers();
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4" />;
      case 'moderator':
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'moderator':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Redirect if not admin
  if (!user || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PageLayout>
      <SEO title="Manage Users - Admin Panel" description="Manage user accounts and permissions" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8" />
              Manage Users
            </h1>
            <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search users by email or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <CardDescription>
              Manage user accounts and their permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading users...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.full_name || 'No name'}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1 w-fit">
                            {getRoleIcon(user.role)}
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{user.phone || 'Not provided'}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={editingUser?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateUser}>
                Update User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
};

export default ManageUsers;