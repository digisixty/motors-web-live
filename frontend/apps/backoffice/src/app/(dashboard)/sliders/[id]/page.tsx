"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useGetSliderById } from "@workspace/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Edit,
  Image as ImageIcon,
  Car,
  Calendar,
  User,
  Power,
  PowerOff,
} from "lucide-react";
import Link from "next/link";
import ImageWithErrorFallback from "@/components/ui/image-with-error-fallback";
import SearchParamsSuspense from "@/components/search-params-suspense";

function SliderDetailPageContent() {
  const params = useParams();
  const sliderId = parseInt(params.id as string);
  const placement = useSearchParams().get("placement");

  const {
    data: sliderData,
    isLoading: isLoadingSlider,
    error: sliderError,
  } = useGetSliderById(sliderId, {
    query: {
      enabled: !!sliderId,
    },
  });

  if (sliderError) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading slider: {sliderError.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoadingSlider) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!sliderData) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              Slider not found
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
          <div className="flex items-center gap-2 mb-2">
            <Link
              href={`/sliders?placement=${placement}`}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sliders
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {sliderData.title || "Untitled Slider"}
          </h1>
          <p className="text-muted-foreground">
            Slider details and configuration
          </p>
        </div>
        <Link href={`/sliders/${sliderData.id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Slider
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Slider Information
            </CardTitle>
            <CardDescription>
              Basic information about the slider
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Title
              </label>
              <p className="font-medium">{sliderData.title || "-"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Description
              </label>
              <p className="text-sm">
                {sliderData.shortDescription || "No description"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <div className="mt-1">
                <Badge
                  variant={sliderData.isEnabled ? "default" : "secondary"}
                  className="flex items-center gap-1 w-fit"
                >
                  {sliderData.isEnabled ? (
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
              </div>
            </div>

            {sliderData.bgColor && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Background Color
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: sliderData.bgColor }}
                  />
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {sliderData.bgColor}
                  </code>
                </div>
              </div>
            )}

            {sliderData.car && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Linked Car
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Car className="w-4 h-4 text-gray-400" />
                  <span>
                    {sliderData.car.manufacturerName}{" "}
                    {sliderData.car.carModelName}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {sliderData.car.stockNumber}
                  </Badge>
                  {sliderData.car.price && (
                    <Badge variant="secondary" className="text-xs">
                      ${sliderData.car.price.toLocaleString()}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Created
                </label>
                <p className="text-sm">
                  {sliderData.created
                    ? new Date(sliderData.created).toLocaleDateString()
                    : "-"}
                </p>
                {/* {sliderData.createdBy && (
                  <p className="text-xs text-muted-foreground">by {sliderData.createdBy}</p>
                )} */}
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Last Modified
                </label>
                <p className="text-sm">
                  {sliderData.lastModified
                    ? new Date(sliderData.lastModified).toLocaleDateString()
                    : "-"}
                </p>
                {/* {sliderData.lastModifiedBy && (
                  <p className="text-xs text-muted-foreground">by {sliderData.lastModifiedBy}</p>
                )} */}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Slider Image</CardTitle>
            <CardDescription>
              The background image displayed on the slider
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sliderData.imageAbsoluteUrl ? (
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <ImageWithErrorFallback
                  src={sliderData.imageAbsoluteUrl}
                  alt={sliderData.title || "Slider image"}
                  fill
                  className="object-cover"
                  fallback={
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  }
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No image selected
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SliderDetailPage() {
  return (
    <SearchParamsSuspense>
      <SliderDetailPageContent />
    </SearchParamsSuspense>
  );
}
