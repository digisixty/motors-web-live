"use client";

import { useState, useEffect } from "react";
import { useGetCarModels, useDeleteCarModel, useGetManufacturers } from "@workspace/api";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Car,
  Building,
} from "lucide-react";
import Link from "next/link";
import ImageWithErrorFallback from "@/components/ui/image-with-error-fallback";
import BulkImportCarModels from "./_components/bulk-import";
import PaginationBox from "@/components/ui/pagination-box";

export default function CarModelsPage() {
  const [manufacturerFilter, setManufacturerFilter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    data: carModelsData,
    isLoading: isLoadingCarModels,
    error: carModelsError,
    refetch: refetchCarModels,
  } = useGetCarModels({
    pageNumber: currentPage,
    pageSize: pageSize,
    manufacturerId: manufacturerFilter,
  }, {
    query: {},
  });

  const {
    data: manufacturersData,
    isLoading: isLoadingManufacturers,
  } = useGetManufacturers({
    query: {},
  });

  const deleteCarModelMutation = useDeleteCarModel({
    mutation: {
      onSuccess: () => {
        toast.success("Car model deleted successfully");
        refetchCarModels();
      },
      onError: (error) => {
        toast.error("Failed to delete car model: " + error.message);
      },
    },
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this car model?")) {
      deleteCarModelMutation.mutate({ id });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset page when manufacturer filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [manufacturerFilter]);

  const carItems = carModelsData?.items || [];
  const totalCount = carModelsData?.totalCount || 0;
  const totalPages = carModelsData?.totalPages || 1;

  const getManufacturerName = (manufacturerId: number) => {
    const manufacturer = manufacturersData?.find(m => m.id === manufacturerId);
    return manufacturer?.title || "Unknown";
  };

  if (carModelsError) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading car models: {carModelsError.message}
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
          <h1 className="text-3xl font-bold tracking-tight">Car Models</h1>
          <p className="text-muted-foreground">
            Manage car models and their information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BulkImportCarModels />
          <Link href="/car-models/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Car Model
            </Button>
          </Link>
        </div>
      </div>

      {manufacturersData && manufacturersData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter by Manufacturer</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={manufacturerFilter?.toString() || "all"}
              onValueChange={(value: string) => setManufacturerFilter(value === "all" ? null : parseInt(value))}
            >
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Select a manufacturer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                {manufacturersData.map((manufacturer) => (
                  <SelectItem key={manufacturer.id} value={manufacturer.id!.toString()}>
                    {manufacturer.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Car Models
          </CardTitle>
          <CardDescription>
            A list of all car models in your system{manufacturerFilter && ` (filtered by manufacturer)`}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingCarModels || isLoadingManufacturers ? (
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full" />
              ))}
            </div>
          ) : carItems.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carItems.map((model: any) => (
                    <TableRow key={model.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {model.imageAbsoluteUrl ? (
                            <div className="w-12 h-12 relative">
                              <ImageWithErrorFallback
                                src={model.imageAbsoluteUrl}
                                alt={model.name || "Car model image"}
                                fill
                                className="object-cover rounded"
                                fallback={<Car className="w-8 h-8 text-gray-400" />}
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded">
                              <Car className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="max-w-[200px] truncate" title={model.name}>
                          {model.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="max-w-[120px] truncate">
                          {model.slug}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span>{model.manufacturerName || getManufacturerName(model.manufacturerId!)}</span>
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
                              <Link href={`/car-models/${model.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/car-models/${model.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(model.id!)}
                              disabled={deleteCarModelMutation.isPending}
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
            {/* Show pagination */}
            {carModelsData && totalPages > 1 && (
              <div className="mt-4">
                <PaginationBox
                  currentPage={currentPage}
                  totalPages={totalPages}
                  hasPreviousPage={carModelsData.hasPreviousPage}
                  hasNextPage={carModelsData.hasNextPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Car className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No car models yet
              </h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                {manufacturerFilter
                  ? "No car models found for this manufacturer."
                  : "Get started by creating your first car model."
                }
              </p>
              {!manufacturerFilter && (
                <Link href="/car-models/create">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Car Model
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}