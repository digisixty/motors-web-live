"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useGetUsersList, useDeleteUser, useGetProfile } from "@workspace/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import PaginationBox from "@/components/ui/pagination-box";
import {
  MoreHorizontal,
  Edit,
  Plus,
  Eye,
  Users,
  Mail,
  Shield,
  Check,
  X,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
  const pageSize = 10;

  const queryClient = useQueryClient();

  const { data: profile } = useGetProfile();

  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useGetUsersList({
    pageNumber: currentPage,
    pageSize: pageSize,
  });

  const deleteUserMutation = useDeleteUser({
    mutation: {
      onSuccess: () => {
        toast.success("User deleted successfully");
        // Invalidate the users list query to refetch the updated data
        queryClient.invalidateQueries({
          queryKey: ['/api/Admin/V1/Users']
        });
        setDeleteConfirmOpen(false);
        setUserToDelete(null);
      },
      onError: (error: any) => {
        if (error.response?.data?.errors) {
          let errorMessage: string;
          const errors = error.response.data.errors;

          if (Array.isArray(errors)) {
            errorMessage = errors.join(", ");
          } else if (typeof errors === 'object' && errors !== null) {
            // Handle object with arrays of error messages
            const errorMessages = Object.values(errors).flatMap(errorArray =>
              Array.isArray(errorArray) ? errorArray : [String(errorArray)]
            );
            errorMessage = errorMessages.join(", ");
          } else {
            errorMessage = String(errors);
          }

          toast.error(errorMessage);
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else if (error.message) {
          toast.error(error.message);
        } else {
          toast.error("An error occurred while deleting the user");
        }
        setDeleteConfirmOpen(false);
        setUserToDelete(null);
      },
    },
  });

  const handleDeleteClick = (user: { id?: string; userName?: string }) => {
    if (user.id && user.userName) {
      setUserToDelete({ id: user.id, name: user.userName });
      setDeleteConfirmOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUserMutation.mutate({
        id: userToDelete.id,
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading users: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage system users and their access permissions
          </p>
        </div>
        <Link href="/users/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            System Users
          </CardTitle>
          <CardDescription>
            A list of all users in the system with their roles and permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: pageSize }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-full" />
              ))}
            </div>
          ) : usersData?.items && usersData.items.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    {/* <TableHead>Email Status</TableHead> */}
                    <TableHead>Roles</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersData.items.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {user.userName?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{user.userName}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {user.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span>{user.email}</span>
                        </div>
                      </TableCell>
                      {/* <TableCell>
                        <div className="flex items-center gap-2">
                          {user.emailConfirmed ? (
                            <>
                              <Check className="h-3 w-3 text-green-600" />
                              <Badge
                                variant="secondary"
                                className="text-green-700 bg-green-100"
                              >
                                Verified
                              </Badge>
                            </>
                          ) : (
                            <>
                              <X className="h-3 w-3 text-red-600" />
                              <Badge
                                variant="secondary"
                                className="text-red-700 bg-red-100"
                              >
                                Not Verified
                              </Badge>
                            </>
                          )}
                        </div>
                      </TableCell> */}
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles && user.roles.length > 0 ? (
                            user.roles.map((role, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs flex items-center gap-1"
                              >
                                <Shield className="h-2 w-2" />
                                {role.name}
                              </Badge>
                            ))
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-muted-foreground"
                            >
                              No roles
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/users/${user.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/users/${user.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            {profile?.id !== user.id && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteClick(user)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {usersData &&
                usersData.totalPages &&
                usersData.totalPages > 1 && (
                  <div className="mt-4">
                    <PaginationBox
                      currentPage={currentPage}
                      totalPages={usersData.totalPages}
                      hasPreviousPage={usersData.hasPreviousPage}
                      hasNextPage={usersData.hasNextPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No users yet</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Get started by creating your first user account.
              </p>
              <Link href="/users/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create User
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Confirm Delete User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the user "{userToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              disabled={deleteUserMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
