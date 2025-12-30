'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Package, CheckCircle2, Clock, Truck, MapPin, ArrowLeft } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Package },
  { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle2 },
  { key: 'processing', label: 'Processing', icon: Clock },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

const deliveryStatusSteps = [
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'assigned', label: 'Assigned to Driver', icon: Truck },
  { key: 'picked_up', label: 'Picked Up', icon: Package },
  { key: 'in_transit', label: 'In Transit', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [currentStatus, setCurrentStatus] = useState<string>('');

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response.data;
    },
    enabled: !!orderId,
    refetchInterval: 10000, // Poll every 10 seconds for updates
  });

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.status);
    }
  }, [order]);

  // TODO: Integrate WebSocket for real-time updates
  // useEffect(() => {
  //   const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');
  //   socket.on(`order:${orderId}`, (data) => {
  //     setCurrentStatus(data.status);
  //     queryClient.invalidateQueries({ queryKey: ['order', orderId] });
  //   });
  //   return () => socket.disconnect();
  // }, [orderId]);

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-semibold text-destructive mb-2">
              Order not found
            </p>
            <Button onClick={() => router.push('/orders')}>
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex((step) => step.key === status.toLowerCase());
  };

  const currentStatusIndex = getStatusIndex(currentStatus || order.status);
  const delivery = order.delivery;

  return (
    <div className="container py-6 md:py-10">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push(`/orders/${orderId}`)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Order Details
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Track Order #{order.orderNumber}</h1>
            <p className="text-muted-foreground mt-1">
              Estimated delivery: {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Tracking */}
        <div className="md:col-span-2 space-y-6">
          {/* Order Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;

                  return (
                    <div key={step.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`rounded-full p-3 ${
                            isCompleted
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <StepIcon className="h-5 w-5" />
                        </div>
                        {index < statusSteps.length - 1 && (
                          <div
                            className={`w-0.5 h-12 ${
                              isCompleted ? 'bg-primary' : 'bg-muted'
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <p
                              className={`font-semibold ${
                                isCompleted ? 'text-foreground' : 'text-muted-foreground'
                              }`}
                            >
                              {step.label}
                            </p>
                            {isCurrent && order.updatedAt && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Updated: {new Date(order.updatedAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                          {isCurrent && (
                            <Badge variant="outline">Current</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Tracking */}
          {delivery && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Delivery Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deliveryStatusSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    const deliveryStatusIndex = deliveryStatusSteps.findIndex(
                      (s) => s.key === delivery.status?.toLowerCase()
                    );
                    const isCompleted = index <= deliveryStatusIndex;
                    const isCurrent = index === deliveryStatusIndex;

                    return (
                      <div key={step.key} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`rounded-full p-2 ${
                              isCompleted
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            <StepIcon className="h-4 w-4" />
                          </div>
                          {index < deliveryStatusSteps.length - 1 && (
                            <div
                              className={`w-0.5 h-8 ${
                                isCompleted ? 'bg-primary' : 'bg-muted'
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-center justify-between">
                            <p
                              className={`text-sm ${
                                isCompleted ? 'text-foreground' : 'text-muted-foreground'
                              }`}
                            >
                              {step.label}
                            </p>
                            {isCurrent && (
                              <Badge variant="outline" className="text-xs">
                                Current
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {delivery.driver && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm font-semibold mb-1">Driver Information</p>
                    <p className="text-sm text-muted-foreground">
                      {delivery.driver.firstName} {delivery.driver.lastName}
                    </p>
                    {delivery.driver.phone && (
                      <p className="text-sm text-muted-foreground">
                        Phone: {delivery.driver.phone}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order Number</span>
                <span className="font-semibold">#{order.orderNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold">EGP {Number(order.total).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <span className="font-semibold">
                  {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          {order.address && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">{order.address.street}</p>
                  <p className="text-muted-foreground">{order.address.city}</p>
                  <p className="text-muted-foreground">
                    {order.address.governorate?.name || order.address.governorate}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Button variant="outline" className="w-full" asChild>
            <Link href={`/orders/${orderId}`}>View Order Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

