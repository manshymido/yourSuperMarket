'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/lib/store/auth-store';
import { Card, CardContent } from '@/components/ui/card';
import { AdminLoadingSkeleton } from '@/components/admin/AdminLoadingSkeleton';

export default function AdminDashboard() {
  const { user } = useAuthStore();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/dashboard');
      return response.data;
    },
    enabled: !!user && user.role === 'ADMIN',
  });

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <AdminLoadingSkeleton count={4} className="grid gap-4 md:grid-cols-4" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-semibold text-destructive mb-2">
              Failed to load dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm text-muted-foreground">Total Users</h3>
              <p className="text-2xl font-bold">{stats.stats.totalUsers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm text-muted-foreground">Total Orders</h3>
              <p className="text-2xl font-bold">{stats.stats.totalOrders}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm text-muted-foreground">Total Products</h3>
              <p className="text-2xl font-bold">{stats.stats.totalProducts}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm text-muted-foreground">Total Revenue</h3>
              <p className="text-2xl font-bold">
                EGP {Number(stats.stats.totalRevenue).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

