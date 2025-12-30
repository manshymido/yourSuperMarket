'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Link from 'next/link';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { AdminLoadingSkeleton } from '@/components/admin/AdminLoadingSkeleton';

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const response = await apiClient.get('/categories', {
        params: { includeInactive: true },
      });
      return response.data || [];
    },
    enabled: !!user && user.role === 'ADMIN',
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      await apiClient.delete(`/categories/${categoryId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to delete category';
      toast.error(message);
    },
  });

  const handleDelete = (categoryId: string, categoryName: string, productCount: number) => {
    if (productCount > 0) {
      toast.error(`Cannot delete category "${categoryName}" because it has ${productCount} product(s)`);
      return;
    }

    if (confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      deleteCategoryMutation.mutate(categoryId);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Category Management</h1>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <AdminLoadingSkeleton />
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-semibold text-destructive mb-2">
              Failed to load categories
            </p>
          </CardContent>
        </Card>
      ) : !categories || categories.length === 0 ? (
        <AdminEmptyState
          icon={FolderTree}
          title="No categories found"
          description="Get started by adding your first category."
          actionLabel="Add Category"
          actionHref="/admin/categories/new"
        />
      ) : (
        <div className="space-y-4">
          {categories.map((category: any) => (
            <Card key={category.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FolderTree className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      {!category.isActive && (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                      {category.parent && (
                        <Badge variant="outline">
                          Parent: {category.parent.name}
                        </Badge>
                      )}
                      {category._count?.products > 0 && (
                        <Badge variant="default">
                          {category._count.products} product{category._count.products !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Slug: {category.slug}</span>
                      {category.children && category.children.length > 0 && (
                        <span>
                          {category.children.length} subcategor{category.children.length !== 1 ? 'ies' : 'y'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        handleDelete(
                          category.id,
                          category.name,
                          category._count?.products || 0
                        )
                      }
                      disabled={deleteCategoryMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

