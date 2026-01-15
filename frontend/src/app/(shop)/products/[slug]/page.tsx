'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, Star, Minus, Plus, Package, CheckCircle2 } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ProductReviews } from '@/components/product/ProductReviews';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { refetch: refetchCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const slug = params.slug as string;

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      // Try slug first, then fallback to ID
      try {
        const response = await apiClient.get(`/products/slug/${slug}`);
        return response.data;
      } catch (err: any) {
        if (err.response?.status === 404) {
          // Try as ID
          const response = await apiClient.get(`/products/${slug}`);
          return response.data;
        }
        throw err;
      }
    },
    enabled: !!slug,
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', product?.id],
    queryFn: async () => {
      const response = await apiClient.get(`/reviews/products/${product.id}`, {
        params: { page: 1, limit: 10 },
      });
      return response.data;
    },
    enabled: !!product?.id,
  });

  const addToCartMutation = useMutation({
    mutationFn: async (qty: number) => {
      await apiClient.post('/cart/items', {
        productId: product.id,
        quantity: qty,
      });
    },
    onSuccess: () => {
      refetchCart();
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(`${product.name} added to cart`);
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        toast.error('Please login to add items to cart');
        router.push('/login?redirect=' + encodeURIComponent(`/products/${slug}`));
      } else {
        toast.error('Failed to add item to cart');
      }
    },
  });

  const handleAddToCart = () => {
    addToCartMutation.mutate(quantity);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(quantity + delta, product?.stock || 1));
    setQuantity(newQuantity);
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-20 rounded" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-semibold text-destructive mb-2">
              Product not found
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push('/products')}>
              Browse Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ['/placeholder-product.jpg'];
  const isOutOfStock = product.stock === 0;
  const averageRating = reviews?.reviews?.reduce((sum: number, r: any) => sum + r.rating, 0) / (reviews?.reviews?.length || 1) || 0;
  const reviewCount = reviews?.total || 0;

  return (
    <div className="container py-6 md:py-10">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted">
            <Image
              src={images[selectedImageIndex]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  Out of Stock
                </Badge>
              </div>
            )}
            {product.category && (
              <Badge className="absolute top-4 left-4">
                {product.category.name}
              </Badge>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative h-20 w-20 flex-shrink-0 rounded border-2 overflow-hidden ${
                    selectedImageIndex === index
                      ? 'border-primary'
                      : 'border-transparent'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              {averageRating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{averageRating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">
                    ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}
            </div>
            <p className="text-3xl font-bold text-primary mb-4">
              EGP {Number(product.price).toFixed(2)}
            </p>
          </div>

          <Separator />

          {product.description && (
            <div>
              <h2 className="font-semibold text-lg mb-2">Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Stock:</span>
              <span className={product.stock > 0 ? 'text-green-600 font-semibold' : 'text-destructive font-semibold'}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>
          </div>

          <Separator />

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-semibold">Quantity:</span>
              <div className="flex items-center gap-2 border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (product.stock || 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleAddToCart}
              disabled={isOutOfStock || addToCartMutation.isPending}
            >
              {addToCartMutation.isPending ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.id && (
        <div className="mt-12">
          <ProductReviews productId={product.id} />
        </div>
      )}
    </div>
  );
}

