'use client';

import Link from 'next/link';
import { Package, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface OrderCardProps {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
    items?: Array<{
      product: {
        name: string;
        images?: string[];
      };
      quantity: number;
    }>;
  };
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export function OrderCard({ order }: OrderCardProps) {
  const statusColor = statusColors[order.status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <Card className="hover-lift card-hover animate-fade-in">
      <Link href={`/orders/${order.id}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  <span>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
            <Badge className={statusColor}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <p className="text-xl font-bold text-primary">
              EGP {Number(order.total).toFixed(2)}
            </p>
          </div>
          <Button variant="outline" className="w-full mt-4" asChild>
            <Link href={`/orders/${order.id}`}>View Details</Link>
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
}

