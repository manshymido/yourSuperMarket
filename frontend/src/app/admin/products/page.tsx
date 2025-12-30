'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Link from 'next/link';
import { AdminPagination } from '@/components/admin/AdminPagination';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { AdminLoadingSkeleton } from '@/components/admin/AdminLoadingSkeleton';

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-products', page],
    queryFn: async () => {
      const response = await apiClient.get('/products', {
        params: { page, limit: pageSize },
      });
      return response.data;
    },
    enabled: !!user && user.role === 'ADMIN',
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      await apiClient.delete(`/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete product');
    },
  });

  const products = data?.products || [];
  const totalPages = Math.ceil((data?.total || 0) / pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <AdminLoadingSkeleton />
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-semibold text-destructive mb-2">
              Failed to load products
            </p>
          </CardContent>
        </Card>
      ) : products.length === 0 ? (
        <AdminEmptyState
          icon={Package}
          title="No products found"
          description="Get started by adding your first product."
          actionLabel="Add Product"
          actionHref="/admin/products/new"
        />
      ) : (
        <>
          <div className="space-y-4">
            {products.map((product: any) => (
              <Card key={product.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        {product.featured && (
                          <Badge>Featured</Badge>
                        )}
                        {!product.active && (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {product.description?.substring(0, 100)}
                        {product.description?.length > 100 ? '...' : ''}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-semibold text-primary">
                          EGP {Number(product.price).toFixed(2)}
                        </span>
                        <span className="text-muted-foreground">
                          Stock: {product.stock || 0}
                        </span>
                        <span className="text-muted-foreground">
                          Category: {product.category?.name || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this product?')) {
                            deleteProductMutation.mutate(product.id);
                          }
                        }}
                        disabled={deleteProductMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <AdminPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

