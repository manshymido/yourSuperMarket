'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';
import { uploadApiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductForm, ProductFormValues } from '@/components/admin/ProductForm';
import { toast } from 'sonner';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues & { images: File[]; stock?: number | null }) => {
      const formData = new FormData();

      // Add all product fields
      formData.append('name', data.name);
      if (data.description) {
        formData.append('description', data.description);
      }
      formData.append('price', data.price.toString());
      if (data.compareAtPrice) {
        formData.append('compareAtPrice', data.compareAtPrice.toString());
      }
      formData.append('categoryId', data.categoryId);
      if (data.sku) {
        formData.append('sku', data.sku);
      }
      if (data.barcode) {
        formData.append('barcode', data.barcode);
      }
      formData.append('isActive', data.isActive.toString());
      formData.append('isFeatured', data.isFeatured.toString());
      if (data.weight) {
        formData.append('weight', data.weight.toString());
      }
      if (data.unit) {
        formData.append('unit', data.unit);
      }

      // Add images
      data.images.forEach((file) => {
        formData.append('images', file);
      });

      // Create product
      const response = await uploadApiClient('/products', formData, 'POST');
      const product = response.data;

      // Update inventory if stock is provided
      if (data.stock !== null && data.stock !== undefined && data.stock > 0) {
        try {
          const { default: apiClient } = await import('@/lib/api-client');
          await apiClient.put(`/inventory/products/${product.id}`, {
            quantity: data.stock,
          });
        } catch (error) {
          console.error('Failed to set initial stock:', error);
          // Don't fail the whole operation if inventory update fails
        }
      }

      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
      router.push('/admin/products');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create product');
    },
  });


  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create New Product</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            onSubmit={async (data) => {
              await createProductMutation.mutateAsync(data);
            }}
            isSubmitting={createProductMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

