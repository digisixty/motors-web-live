"use client";

import { useState } from "react";
import { useGetSliders, useDeleteSlider } from "@workspace/api";
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
  Image as ImageIcon,
  Video as VideoIcon,
  Power,
  PowerOff,
} from "lucide-react";
import Link from "next/link";
import ImageWithErrorFallback from "@/components/ui/image-with-error-fallback";
import { useSearchParams } from "next/navigation";
import SearchParamsSuspense from "@/components/search-params-suspense";

function SlidersPageContent() {
  const placement = useSearchParams().get("placement");

  const {
    data: slidersData,
    isLoading: isLoadingSliders,
    error: slidersError,
    refetch: refetchSliders,
  } = useGetSliders({ placement: placement as any });

  const deleteSliderMutation = useDeleteSlider({
    mutation: {
      onSuccess: () => {
        toast.success("Slider deleted successfully");
        refetchSliders();
      },
      onError: (error) => {
        toast.error("Failed to delete slider: " + error.message);
      },
    },
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this slider?")) {
      deleteSliderMutation.mutate({ id });
    }
  };

  if (slidersError) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading sliders: {slidersError.message}
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
          <h1 className="text-3xl font-bold tracking-tight">Sliders</h1>
          <p className="text-muted-foreground">
            Manage homepage sliders and promotional banners
          </p>
        </div>
        <Link href={`/sliders/create?placement=${placement}`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Slider
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Sliders
          </CardTitle>
          <CardDescription>
            A list of all sliders displayed on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSliders ? (
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full" />
              ))}
            </div>
          ) : slidersData &&
            slidersData.items &&
            slidersData.items.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Media</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Car</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slidersData.items.map((slider) => (
                    <TableRow key={slider.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {slider.videoAbsoluteUrl ? (
                            <div className="w-16 h-10 relative">
                              <div className="w-full h-full bg-black rounded flex items-center justify-center">
                                <VideoIcon className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          ) : slider.imageAbsoluteUrl ? (
                            <div className="w-16 h-10 relative">
                              <ImageWithErrorFallback
                                src={slider.imageAbsoluteUrl}
                                alt={slider.title || "Slider image"}
                                fill
                                className="object-cover rounded"
                                fallback={
                                  <ImageIcon className="w-8 h-8 text-gray-400" />
                                }
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-10 flex items-center justify-center bg-gray-100 rounded">
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div
                          className="max-w-[200px] truncate"
                          title={slider.title}
                        >
                          {slider.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className="max-w-[250px] truncate text-sm text-muted-foreground"
                          title={slider.shortDescription || undefined}
                        >
                          {slider.shortDescription || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[150px] truncate text-sm">
                          {slider.car ? (
                            <span>
                              {slider.car.manufacturerName}{" "}
                              {slider.car.carModelName}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={slider.isEnabled ? "default" : "secondary"}
                          className="flex items-center gap-1 w-fit"
                        >
                          {slider.isEnabled ? (
                            <>
                              <Power className="w-3 h-3" />
                              Enabled
                            </>
                          ) : (
                            <>
                              <PowerOff className="w-3 h-3" />
                              Disabled
                            </>
                          )}
                        </Badge>
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
                              <Link
                                href={`/sliders/${slider.id}?placement=${placement}`}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/sliders/${slider.id}/edit?placement=${placement}`}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(slider.id!)}
                              disabled={deleteSliderMutation.isPending}
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
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No sliders yet</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Get started by creating your first slider for the homepage.
              </p>
              <Link href={`/sliders/create?placement=${placement}`}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Slider
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function SlidersPage() {
  return (
    <SearchParamsSuspense>
      <SlidersPageContent />
    </SearchParamsSuspense>
  );
}
