'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, MapPin, DollarSign, CheckCircle2, Loader2 } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function DriverAvailablePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: deliveries, isLoading, error } = useQuery({
    queryKey: ['available-deliveries'],
    queryFn: async () => {
      const response = await apiClient.get('/delivery/available');
      return response.data || [];
    },
    enabled: !!user && user.role === 'DRIVER',
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const acceptDeliveryMutation = useMutation({
    mutationFn: async (deliveryId: string) => {
      await apiClient.post(`/delivery/${deliveryId}/accept`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['my-deliveries'] });
      toast.success('Delivery accepted successfully');
      router.push('/driver');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to accept delivery');
    },
  });

  useEffect(() => {
    if (user && user.role !== 'DRIVER') {
      router.push('/');
    }
  }, [user, router]);

  if (!user || user.role !== 'DRIVER') {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8">Available Deliveries</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-semibold text-destructive mb-2">
              Failed to load deliveries
            </p>
            <Button onClick={() => router.push('/driver')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Available Deliveries</h1>
        <Button variant="outline" onClick={() => router.push('/driver')}>
          My Deliveries
        </Button>
      </div>

      {!deliveries || deliveries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No available deliveries</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              There are no deliveries available at the moment. Check back later for new delivery opportunities.
            </p>
            <Button onClick={() => router.push('/driver')}>
              View My Deliveries
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {deliveries.map((delivery: any) => (
            <Card key={delivery.id} className="hover-lift">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">
                        Order #{delivery.order?.orderNumber || delivery.orderId}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {delivery.order?.address?.street}, {delivery.order?.address?.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>EGP {Number(delivery.order?.total || 0).toFixed(2)}</span>
                      </div>
                    </div>
                    {delivery.order?.address?.governorate && (
                      <Badge variant="outline">
                        {delivery.order.address.governorate.name || delivery.order.address.governorate}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => acceptDeliveryMutation.mutate(delivery.id)}
                      disabled={acceptDeliveryMutation.isPending}
                    >
                      {acceptDeliveryMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Accepting...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Accept Delivery
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

