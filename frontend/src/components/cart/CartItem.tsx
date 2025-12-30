'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';
import { useCart } from '@/hooks/use-cart';

interface CartItemProps {
  item: {
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: number;
      images?: string[];
    };
  };
}

export function CartItem({ item }: CartItemProps) {
  const { refetch } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      await apiClient.put(`/cart/items/${item.id}`, {
        quantity: newQuantity,
      });
      await refetch();
      toast.success('Cart updated');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await apiClient.delete(`/cart/items/${item.id}`);
      await refetch();
      toast.success('Item removed from cart');
    } catch (error: any) {
      toast.error('Failed to remove item');
    } finally {
      setIsRemoving(false);
    }
  };

  const imageUrl = item.product.images && item.product.images.length > 0 
    ? item.product.images[0] 
    : '/placeholder-product.jpg';

  return (
    <Card className="animate-fade-in">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
            <Image
              src={imageUrl}
              alt={item.product.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1 line-clamp-2">
              {item.product.name}
            </h3>
            <p className="text-primary font-bold text-lg mb-3">
              EGP {Number(item.product.price).toFixed(2)}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={isUpdating || item.quantity <= 1}
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Minus className="h-4 w-4" />
                  )}
                </Button>
                <span className="w-12 text-center font-medium">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <p className="text-lg font-bold">
                  EGP {(Number(item.product.price) * item.quantity).toFixed(2)}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleRemove}
                  disabled={isRemoving}
                >
                  {isRemoving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

