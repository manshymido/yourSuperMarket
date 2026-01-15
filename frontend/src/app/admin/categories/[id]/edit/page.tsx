'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryForm, CategoryFormValues } from '@/components/admin/CategoryForm';
import { toast } from 'sonner';
import Link from 'next/link';

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const categoryId = params.id as string;

  const { data: category, isLoading, error } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const response = await apiClient.get(`/categories/${categoryId}`);
      return response.data;
    },
    enabled: !!categoryId,
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      const categoryData: any = {};

      if (data.name) categoryData.name = data.name;
      if (data.description !== undefined) categoryData.description = data.description;
      if (data.parentId !== undefined) categoryData.parentId = data.parentId;
      if (data.isActive !== undefined) categoryData.isActive = data.isActive;

      const response = await apiClient.patch(`/categories/${categoryId}`, categoryData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category', categoryId] });
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', 'all'] });
      toast.success('Category updated successfully');
      router.push('/admin/categories');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to update category'
      );
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

  if (error || !category) {
    return (
      <div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-semibold text-destructive mb-2">
              Category not found
            </p>
            <Button asChild>
              <Link href="/admin/categories">Back to Categories</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initialValues = {
    name: category.name,
    description: category.description || '',
    parentId: category.parentId || null,
    isActive: category.isActive ?? true,
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/categories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Category</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm
            initialValues={initialValues}
            onSubmit={async (data) => {
              await updateCategoryMutation.mutateAsync(data);
            }}
            isSubmitting={updateCategoryMutation.isPending}
            excludeCategoryId={categoryId}
          />
        </CardContent>
      </Card>
    </div>
  );
}

