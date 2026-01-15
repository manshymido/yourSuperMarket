'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CartSummaryProps {
  subtotal: number;
  shipping?: number;
  discount?: number;
  onCheckout?: () => void;
}

export function CartSummary({ subtotal, shipping = 0, discount = 0, onCheckout }: CartSummaryProps) {
  const router = useRouter();
  const total = subtotal + shipping - discount;

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      router.push('/checkout');
    }
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Coupon Code */}
        <div className="space-y-2">
          <Label htmlFor="coupon">Coupon Code</Label>
          <div className="flex gap-2">
            <Input id="coupon" placeholder="Enter code" />
            <Button variant="outline" size="sm">
              Apply
            </Button>
          </div>
        </div>

        <Separator />

        {/* Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>EGP {subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-EGP {discount.toFixed(2)}</span>
            </div>
          )}
          {shipping > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>EGP {shipping.toFixed(2)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">EGP {total.toFixed(2)}</span>
          </div>
        </div>

        <Button className="w-full" size="lg" onClick={handleCheckout}>
          Proceed to Checkout
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Free shipping on orders over EGP 500
        </p>
      </CardContent>
    </Card>
  );
}

