"use client";

import { useState } from "react";
import { useGetBlogsList, useDeleteBlog } from "@workspace/api";
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
import { Skeleton } from "@/components/ui/skeleton";
import PaginationBox from "@/components/ui/pagination-box";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Edit,
  Trash,
  Plus,
  Eye,
  Calendar,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function BlogsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    data: blogsData,
    isLoading,
    error,
    refetch,
  } = useGetBlogsList({
    pageNumber: currentPage,
    pageSize: pageSize,
  });

  const deleteBlogMutation = useDeleteBlog({
    mutation: {
      onSuccess: () => {
        toast.success("Blog deleted successfully");
        refetch();
      },
      onError: (error) => {
        toast.error("Failed to delete blog: " + error.message);
      },
    },
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      deleteBlogMutation.mutate({ id });
    }
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
              Error loading blogs: {error.message}
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
          <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
          <p className="text-muted-foreground">
            Manage your blog posts and content
          </p>
        </div>
        <Link href="/blogs/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Blog
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Blog Posts
          </CardTitle>
          <CardDescription>
            A list of all blog posts in your system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: pageSize }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-full" />
              ))}
            </div>
          ) : blogsData?.items && blogsData.items.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogsData.items.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell className="font-medium">
                        <div
                          className="max-w-[200px] truncate"
                          title={blog.title}
                        >
                          {blog.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="max-w-[120px] truncate"
                        >
                          {blog.slug}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div
                          className="max-w-[300px] truncate text-sm text-muted-foreground"
                          title={blog.shortDescription || undefined}
                        >
                          {blog.shortDescription || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {blog.created
                            ? format(new Date(blog.created), "MMM d, yyyy")
                            : "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {blog.lastModified
                            ? format(new Date(blog.lastModified), "MMM d, yyyy")
                            : "-"}
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
                              <Link href={`/blogs/${blog.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/blogs/${blog.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(blog.id!)}
                              disabled={deleteBlogMutation.isPending}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {blogsData &&
                blogsData.totalPages &&
                blogsData.totalPages > 1 && (
                  <div className="mt-4">
                    <PaginationBox
                      currentPage={currentPage}
                      totalPages={blogsData.totalPages}
                      hasPreviousPage={blogsData.hasPreviousPage}
                      hasNextPage={blogsData.hasNextPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No blog posts yet</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Get started by creating your first blog post.
              </p>
              <Link href="/blogs/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Blog
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
