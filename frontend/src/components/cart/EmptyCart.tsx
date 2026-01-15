'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function EmptyCart() {
  return (
    <Card className="animate-fade-in">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <ShoppingCart className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
        </p>
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

