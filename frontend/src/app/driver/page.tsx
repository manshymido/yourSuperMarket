'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';

export default function DriverDashboard() {
  const router = useRouter();
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }
      const response = await apiClient.get('/delivery/driver/my-deliveries');
      setDeliveries(response.data || []);
    } catch (error) {
      console.error('Failed to fetch deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container py-10">Loading deliveries...</div>;
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">My Deliveries</h1>
      {deliveries.length === 0 ? (
        <p className="text-muted-foreground">You have no deliveries</p>
      ) : (
        <div className="space-y-4">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    Order #{delivery.order.orderNumber}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {delivery.order.address.street}, {delivery.order.address.city}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize mt-2">
                    Status: {delivery.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

