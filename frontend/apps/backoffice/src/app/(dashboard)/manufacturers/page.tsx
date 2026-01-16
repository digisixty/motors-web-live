"use client";

import { useState } from "react";
import { useGetManufacturers, useDeleteManufacturer } from "@workspace/api";
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
import { toast } from "sonner";
import {
  MoreHorizontal,
  Edit,
  Trash,
  Plus,
  Eye,
  Building,
  Image,
} from "lucide-react";
import Link from "next/link";
import ImageWithErrorFallback from "@/components/ui/image-with-error-fallback";

export default function ManufacturersPage() {
  const {
    data: manufacturersData,
    isLoading,
    error,
    refetch,
  } = useGetManufacturers({
    query: {},
  });

  const deleteManufacturerMutation = useDeleteManufacturer({
    mutation: {
      onSuccess: () => {
        toast.success("Manufacturer deleted successfully");
        refetch();
      },
      onError: (error) => {
        toast.error("Failed to delete manufacturer: " + error.message);
      },
    },
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this manufacturer?")) {
      deleteManufacturerMutation.mutate({ id });
    }
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading manufacturers: {error.message}
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
          <h1 className="text-3xl font-bold tracking-tight">Manufacturers</h1>
          <p className="text-muted-foreground">
            Manage car manufacturers and their information
          </p>
        </div>
        <Link href="/manufacturers/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Manufacturer
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Manufacturers
          </CardTitle>
          <CardDescription>
            A list of all car manufacturers in your system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full" />
              ))}
            </div>
          ) : manufacturersData && manufacturersData.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Logo</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {manufacturersData.map((manufacturer) => (
                    <TableRow key={manufacturer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {manufacturer.logoAbsoluteUrl ? (
                            <div className="w-12 h-12 relative">
                              <ImageWithErrorFallback
                                src={manufacturer.logoAbsoluteUrl}
                                alt={manufacturer.title || "Manufacturer logo"}
                                fill
                                className="object-contain rounded"
                                fallback={<Building className="w-8 h-8 text-gray-400" />}
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded">
                              <Building className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="max-w-[200px] truncate" title={manufacturer.title}>
                          {manufacturer.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="max-w-[120px] truncate">
                          {manufacturer.slug}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div
                          className="max-w-[300px] truncate text-sm text-muted-foreground"
                          title={manufacturer.description || undefined}
                        >
                          {manufacturer.description || "-"}
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
                              <Link href={`/manufacturers/${manufacturer.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/manufacturers/${manufacturer.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(manufacturer.id!)}
                              disabled={deleteManufacturerMutation.isPending}
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
              <Building className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No manufacturers yet
              </h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Get started by creating your first manufacturer.
              </p>
              <Link href="/manufacturers/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Manufacturer
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}