"use client";

import Image from "next/image";
import { useGetCarListingById } from "@workspace/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  ArrowLeft,
  Edit,
  Car as CarIcon,
  Image as ImageIcon,
  Video,
  DollarSign,
  Tag,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import VideoPlayer from "@/components/video-player";

export default function CarListingDetailPage({ id }: { id: string }) {
  const carId = parseInt(id);

  // Use the proper single car API
  const {
    data: car,
    isLoading,
    error,
  } = useGetCarListingById(!isNaN(carId) ? carId : 0, {
    query: {
      enabled: !isNaN(carId),
    },
  });

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading car listing: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="mb-6">
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-8 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
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
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isNaN(carId)) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">Invalid car ID</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Car listing not found</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="mb-6">
        <Link href="/car-listings">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Car Listings
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {car.stockNumber || "Car Listing"}
            </h1>
            <p className="text-muted-foreground">
              View and manage this car listing
            </p>
          </div>
          <Link href={`/car-listings/${car.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Car
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CarIcon className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Main details about the vehicle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm">Stock Number</h4>
              <p className="text-sm">{car.stockNumber || "-"}</p>
            </div>

            {car.manufacturerName && (
              <div>
                <h4 className="font-semibold text-sm">Manufacturer</h4>
                <p className="text-sm">{car.manufacturerName}</p>
              </div>
            )}

            {car.carModelName && (
              <div>
                <h4 className="font-semibold text-sm">Car Model</h4>
                <p className="text-sm">{car.carModelName}</p>
              </div>
            )}

            {car.vinNumber && (
              <div>
                <h4 className="font-semibold text-sm">VIN Number</h4>
                <p className="text-sm font-mono">{car.vinNumber}</p>
              </div>
            )}

            {car.registrationDate && (
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Registration Date
                </h4>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(car.registrationDate), "PPP")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing & Status
            </CardTitle>
            <CardDescription>
              Price information and listing status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm">Price</h4>
              <p className="text-sm font-medium">
                {car.price ? `$${car.price.toLocaleString()}` : "-"}
              </p>
            </div>

            {car.salePrice && (
              <div>
                <h4 className="font-semibold text-sm">Sale Price</h4>
                <p className="text-sm font-medium text-green-600">
                  ${car.salePrice.toLocaleString()}
                </p>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-sm">Status</h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={car.isSold ? "destructive" : "default"}>
                  {car.isSold ? "Sold" : "Available"}
                </Badge>
                {car.isSpecialOffer && (
                  <Badge variant="secondary">Special Offer</Badge>
                )}
                {car.customPriceLabel && (
                  <Badge variant="outline">{car.customPriceLabel}</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {car.carListingAttributes && car.carListingAttributes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Vehicle Attributes
            </CardTitle>
            <CardDescription>Additional vehicle specifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {car.carListingAttributes.map((attr, index) => (
                <div key={index} className="border rounded-md p-3">
                  <h5 className="font-medium text-sm">
                    {attr.carAttributeName}
                  </h5>
                  <p className="text-sm text-muted-foreground">{attr.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {car.carListingOptions && car.carListingOptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Vehicle Options
            </CardTitle>
            <CardDescription>
              Available features and options for this vehicle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {car.carListingOptions
                ?.filter((a) => a?.value !== null && a?.value !== "false")
                .map((option, index) => (
                  <div key={index} className="border rounded-md p-3 ">
                    <h5 className="font-medium text-sm">
                      {option.carOptionName}
                    </h5>
                    {option.value && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {option.value}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {car.primaryImageAbsoluteUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Primary Image
            </CardTitle>
            <CardDescription>Main image for this car listing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="relative h-48 w-full rounded-md overflow-hidden border">
                <Image
                  src={car.primaryImageAbsoluteUrl.trim()}
                  alt={`Primary car image`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement!.innerHTML = `
                      <div class="w-full h-48 flex items-center justify-center text-xs text-muted-foreground text-center p-2">
                        Failed to load primary image
                      </div>
                    `;
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {(car.absoluteInteriorImages && car.absoluteInteriorImages.length > 0) ||
        (car.absoluteExteriorImages &&
          car.absoluteExteriorImages.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {car.absoluteInteriorImages &&
                car.absoluteInteriorImages.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Interior Images
                      </CardTitle>
                      <CardDescription>
                        Interior images for this car listing
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {car.absoluteInteriorImages?.map((image, index) => (
                          <div
                            key={`interior-${index}`}
                            className="relative h-24 w-full rounded-md overflow-hidden border"
                          >
                            <Image
                              src={image.trim()}
                              alt={`Interior car image ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 25vw"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.parentElement!.innerHTML = `
                            <div class="w-full h-24 flex items-center justify-center text-xs text-muted-foreground text-center p-2">
                              Failed to load interior image
                            </div>
                          `;
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {car.absoluteExteriorImages &&
                car.absoluteExteriorImages.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Exterior Images
                      </CardTitle>
                      <CardDescription>
                        Exterior images for this car listing
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {car.absoluteExteriorImages?.map((image, index) => (
                          <div
                            key={`exterior-${index}`}
                            className="relative h-24 w-full rounded-md overflow-hidden border"
                          >
                            <Image
                              src={image.trim()}
                              alt={`Exterior car image ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 25vw"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.parentElement!.innerHTML = `
                            <div class="w-full h-24 flex items-center justify-center text-xs text-muted-foreground text-center p-2">
                              Failed to load exterior image
                            </div>
                          `;
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </div>
          ))}

      {car.absoluteVideos && car.absoluteVideos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Videos
            </CardTitle>
            <CardDescription>
              Video content for this car listing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {car.absoluteVideos.map((video, index) => (
                <div key={index} className="space-y-2">
                  <p className="text-sm font-medium">Video {index + 1}</p>
                  <VideoPlayer
                    videoUrl={video.trim()}
                    className="h-64 w-full"
                  />
                  <p className="text-xs text-muted-foreground break-all">
                    {video.trim()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
