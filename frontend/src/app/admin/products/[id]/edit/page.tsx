'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';
import { uploadApiClient } from '@/lib/api-client';
import apiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductForm, ProductFormValues } from '@/components/admin/ProductForm';
import { toast } from 'sonner';
import Link from 'next/link';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const productId = params.id as string;

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await apiClient.get(`/products/${productId}`);
      return response.data;
    },
    enabled: !!productId && !!user && user.role === 'ADMIN',
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues & { images: File[]; existingImages?: string[]; removedImages?: string[]; stock?: number | null }) => {
      // If no new images and we're just updating fields, use regular API call
      // Otherwise use multipart for file uploads
      if (data.images.length === 0) {
        const productData: any = {
          name: data.name,
          price: data.price,
          isActive: data.isActive,
          isFeatured: data.isFeatured,
        };

        if (data.description) productData.description = data.description;
        if (data.compareAtPrice) productData.compareAtPrice = data.compareAtPrice;
        if (data.categoryId) productData.categoryId = data.categoryId;
        if (data.sku) productData.sku = data.sku;
        if (data.barcode) productData.barcode = data.barcode;
        if (data.weight) productData.weight = data.weight;
        if (data.unit) productData.unit = data.unit;

        // Send final images array (existing minus removed)
        const finalImages = (data.existingImages || []).filter(
          (url) => !data.removedImages?.includes(url)
        );
        if (finalImages.length > 0) {
          productData.images = finalImages;
        }

        const response = await apiClient.patch(`/products/${productId}`, productData);
        return response.data;
      }

      // Use multipart for file uploads
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
      if (data.categoryId) {
        formData.append('categoryId', data.categoryId);
      }
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

      // Send existing images we want to keep (as strings in the images array)
      // Backend will merge these with new uploaded files
      const finalImages = (data.existingImages || []).filter(
        (url) => !data.removedImages?.includes(url)
      );
      finalImages.forEach((url) => {
        formData.append('images', url);
      });

      // Add new image files
      data.images.forEach((file) => {
        formData.append('images', file);
      });

      // Update product
      const response = await uploadApiClient(`/products/${productId}`, formData, 'PATCH');
      const updatedProduct = response.data;

      // Update inventory if stock is provided and different
      if (data.stock !== null && data.stock !== undefined) {
        try {
          await apiClient.put(`/inventory/products/${productId}`, {
            quantity: data.stock,
          });
        } catch (error) {
          console.error('Failed to update stock:', error);
          // Don't fail the whole operation if inventory update fails
        }
      }

      return updatedProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
      router.push('/admin/products');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update product');
    },
  });


  if (isLoading) {
    return (
      <div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-semibold text-destructive mb-2">
              Product not found
            </p>
            <Button asChild>
              <Link href="/admin/products">Back to Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch current inventory
  const { data: inventory } = useQuery({
    queryKey: ['inventory', productId],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`/inventory/products/${productId}`);
        return response.data;
      } catch {
        return null;
      }
    },
    enabled: !!productId,
  });

  const initialValues = {
    name: product.name,
    description: product.description || '',
    price: product.price,
    compareAtPrice: product.compareAtPrice || null,
    categoryId: product.categoryId || product.category?.id || '',
    sku: product.sku || '',
    barcode: product.barcode || '',
    isActive: product.isActive ?? product.active ?? true,
    isFeatured: product.isFeatured ?? product.featured ?? false,
    weight: product.weight || null,
    unit: product.unit || '',
    stock: inventory?.quantity || product.stock || null,
    images: product.images || [],
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Product</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            initialValues={initialValues}
            onSubmit={async (data) => {
              await updateProductMutation.mutateAsync(data);
            }}
            isSubmitting={updateProductMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

