'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { Skeleton } from '@/components/ui/skeleton';

export default function CartPage() {
  const router = useRouter();
  const { cart, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex gap-4">
                  <Skeleton className="w-24 h-24 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <EmptyCart />
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum: number, item: any) => {
    return sum + Number(item.product.price) * item.quantity;
  }, 0);

  const shipping = subtotal >= 500 ? 0 : 50; // Free shipping over 500 EGP

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {cart.items.map((item: any) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <div>
          <CartSummary
            subtotal={subtotal}
            shipping={shipping}
            discount={0}
          />
        </div>
      </div>
    </div>
  );
}
