"use client";

import { useState } from "react";
import { useGetStaticContents, useDeleteStaticContent } from "@workspace/api";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Edit,
  Trash,
  Plus,
  Eye,
  FileText,
} from "lucide-react";
import Link from "next/link";
import ImageWithErrorFallback from "@/components/ui/image-with-error-fallback";

function StaticContentsPageContent() {
  const {
    data: staticContentsData,
    isLoading: isLoadingStaticContents,
    error: staticContentsError,
    refetch: refetchStaticContents,
  } = useGetStaticContents({});

  const deleteStaticContentMutation = useDeleteStaticContent({
    mutation: {
      onSuccess: () => {
        toast.success("Static content deleted successfully");
        refetchStaticContents();
      },
      onError: (error) => {
        toast.error("Failed to delete static content: " + error.message);
      },
    },
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this static content?")) {
      deleteStaticContentMutation.mutate({ id });
    }
  };

  if (staticContentsError) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading static contents: {staticContentsError.message}
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
          <h1 className="text-3xl font-bold tracking-tight">Static Contents</h1>
          <p className="text-muted-foreground">
            Manage static content pages
          </p>
        </div>
        <Link href="/static-contents/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Static Content
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Static Contents
          </CardTitle>
          <CardDescription>
            A list of all static content pages
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingStaticContents ? (
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full" />
              ))}
            </div>
          ) : staticContentsData &&
            staticContentsData.items &&
            staticContentsData.items.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staticContentsData.items.map((staticContent) => (
                    <TableRow key={staticContent.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {staticContent.mainImageAbsoluteUrl ? (
                            <div className="w-16 h-10 relative">
                              <ImageWithErrorFallback
                                src={staticContent.mainImageAbsoluteUrl}
                                alt={staticContent.title || "Static content image"}
                                fill
                                className="object-cover rounded"
                                fallback={
                                  <FileText className="w-8 h-8 text-gray-400" />
                                }
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-10 flex items-center justify-center bg-gray-100 rounded">
                              <FileText className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div
                          className="max-w-[200px] truncate"
                          title={staticContent.title}
                        >
                          {staticContent.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className="max-w-[150px] truncate text-sm text-muted-foreground"
                          title={staticContent.slug}
                        >
                          {staticContent.slug}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className="max-w-[300px] truncate text-sm text-muted-foreground"
                          title={staticContent.description}
                        >
                          {staticContent.description}
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
                              <Link href={`/static-contents/${staticContent.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/static-contents/${staticContent.id}/edit`}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(staticContent.id!)}
                              disabled={deleteStaticContentMutation.isPending}
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
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No static contents yet
              </h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Get started by creating your first static content page.
              </p>
              <Link href="/static-contents/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Static Content
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function StaticContentsPage() {
  return <StaticContentsPageContent />;
}
