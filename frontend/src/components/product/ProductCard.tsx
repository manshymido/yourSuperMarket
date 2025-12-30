'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';
import { useCart } from '@/hooks/use-cart';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug?: string;
    price: number;
    images?: string[];
    description?: string;
    stock?: number;
    rating?: number;
    category?: {
      name: string;
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { refetch } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    try {
      await apiClient.post('/cart/add', {
        productId: product.id,
        quantity: 1,
      });
      await refetch();
      toast.success(`${product.name} added to cart`);
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Please login to add items to cart');
      } else {
        toast.error('Failed to add item to cart');
      }
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = product.stock !== undefined && product.stock === 0;
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.jpg';

  return (
    <Card className="group overflow-hidden hover-lift card-hover animate-fade-in">
      <Link href={`/products/${product.slug || product.id}`}>
        <CardHeader className="p-0 relative aspect-square overflow-hidden bg-muted">
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  Out of Stock
                </Badge>
              </div>
            )}
            {product.category && (
              <Badge className="absolute top-2 left-2">
                {product.category.name}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.rating !== undefined && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <p className="text-xl font-bold text-primary">
              EGP {Number(product.price).toFixed(2)}
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            size="sm"
          >
            {isAdding ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}

