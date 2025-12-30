'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, User as UserIcon } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/lib/store/auth-store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminPagination } from '@/components/admin/AdminPagination';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { AdminLoadingSkeleton } from '@/components/admin/AdminLoadingSkeleton';

export default function AdminUsersPage() {
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: async () => {
      const response = await apiClient.get('/admin/users', {
        params: { page, limit: pageSize },
      });
      return response.data;
    },
    enabled: !!user && user.role === 'ADMIN',
  });

  const users = data?.users || data || [];
  const totalPages = Math.ceil((data?.total || users.length) / pageSize);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">User Management</h1>

      {isLoading ? (
        <AdminLoadingSkeleton />
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-semibold text-destructive mb-2">
              Failed to load users
            </p>
          </CardContent>
        </Card>
      ) : users.length === 0 ? (
        <AdminEmptyState
          icon={Users}
          title="No users found"
        />
      ) : (
        <>
          <div className="space-y-4">
            {users.map((userItem: any) => (
              <Card key={userItem.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold text-lg">
                          {userItem.firstName} {userItem.lastName}
                        </h3>
                        <Badge variant={userItem.role === 'ADMIN' ? 'default' : 'secondary'}>
                          {userItem.role}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{userItem.email}</span>
                        {userItem.phone && <span>{userItem.phone}</span>}
                        <span>
                          Joined: {new Date(userItem.createdAt).toLocaleDateString()}
                        </span>
                      </div>
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

