'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Package } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { OrderCard } from '@/components/order/OrderCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function OrdersPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders', statusFilter],
    queryFn: async () => {
      const params: any = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const response = await apiClient.get('/orders', { params });
      return response.data || [];
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-semibold text-destructive mb-2">
              Failed to load orders
            </p>
            <p className="text-sm text-muted-foreground">
              Please try again later
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredOrders = orders || [];

  return (
    <div className="container py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredOrders.length === 0 ? (
        <Card className="animate-fade-in">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No orders found</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              {statusFilter === 'all'
                ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                : `No orders with status "${statusFilter}" found.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order: any) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
