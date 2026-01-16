"use client";

import { useState } from "react";
import { useGetCarListings2, useDeleteCarListing, useDuplicateCarListing } from "@workspace/api";
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
import { Input } from "@/components/ui/input";
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
  Car,
  DollarSign,
  Tag,
  Copy,
  Search,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function CarListingsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;

  const {
    data: carListingsData,
    isLoading,
    error,
    refetch,
  } = useGetCarListings2({
    pageNumber: currentPage,
    pageSize: pageSize,
    searchq: searchQuery || null,
  });

  const deleteCarListingMutation = useDeleteCarListing({
    mutation: {
      onSuccess: () => {
        toast.success("Car listing deleted successfully");
        refetch();
      },
      onError: (error) => {
        toast.error("Failed to delete car listing: " + error.message);
      },
    },
  });

  const duplicateCarListingMutation = useDuplicateCarListing({
    mutation: {
      onSuccess: () => {
        toast.success("Car listing duplicated successfully");
        refetch();
      },
      onError: (error) => {
        toast.error("Failed to duplicate car listing: " + error.message);
      },
    },
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this car listing?")) {
      deleteCarListingMutation.mutate({ id });
    }
  };

  const handleDuplicate = async (id: number) => {
    duplicateCarListingMutation.mutate({ id });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading car listings: {error.message}
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
          <h1 className="text-3xl font-bold tracking-tight">Car Listings</h1>
          <p className="text-muted-foreground">
            Manage your vehicle inventory and listings
          </p>
        </div>
        <Link href="/car-listings/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Car
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Vehicle Inventory
          </CardTitle>
          <CardDescription>
            A list of all car listings in your inventory.
          </CardDescription>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by stock number, VIN, or other details..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: pageSize }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-full" />
              ))}
            </div>
          ) : carListingsData?.items && carListingsData.items.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stock #</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>VIN</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Special</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carListingsData.items.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          <span>{car.stockNumber || "-"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Car className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">
                            {car.manufacturerName && car.carModelName
                              ? `${car.manufacturerName} ${car.carModelName}`
                              : "-"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[120px] truncate font-mono text-sm">
                          {car.vinNumber || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          {car.price ? (
                            <span className="font-medium">
                              ${car.price.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={car.isSold ? "destructive" : "default"}
                          >
                            {car.isSold ? "Sold" : "Available"}
                          </Badge>
                          {car.salePrice && (
                            <Badge variant="secondary">Sale</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {car.isSpecialOffer && (
                            <Badge variant="outline">Special</Badge>
                          )}
                          {car.customPriceLabel && (
                            <Badge variant="secondary">
                              {car.customPriceLabel}
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
                              <Link href={`/car-listings/${car.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/car-listings/${car.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicate(car.id!)}
                              disabled={duplicateCarListingMutation.isPending}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(car.id!)}
                              disabled={deleteCarListingMutation.isPending}
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
              {carListingsData &&
                carListingsData.totalPages &&
                carListingsData.totalPages > 1 && (
                  <div className="mt-4">
                    <PaginationBox
                      currentPage={currentPage}
                      totalPages={carListingsData.totalPages}
                      hasPreviousPage={carListingsData.hasPreviousPage}
                      hasNextPage={carListingsData.hasNextPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Car className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No car listings yet
              </h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Get started by adding your first car to the inventory.
              </p>
              <Link href="/car-listings/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Car
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
