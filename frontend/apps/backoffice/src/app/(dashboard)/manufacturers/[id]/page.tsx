"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetManufacturerById } from "@workspace/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Building, Car } from "lucide-react";
import Link from "next/link";
import ImageWithErrorFallback from "@/components/ui/image-with-error-fallback";

export default function ManufacturerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const {
    data: manufacturer,
    isLoading,
    error,
  } = useGetManufacturerById(id, {
    query: {
      enabled: !!id,
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="mb-6">
          <Link href="/manufacturers" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Manufacturers
          </Link>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="mb-6">
          <Link href="/manufacturers" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Manufacturers
          </Link>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading manufacturer: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!manufacturer) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="mb-6">
          <Link href="/manufacturers" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Manufacturers
          </Link>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Manufacturer not found</h3>
              <p className="text-muted-foreground">
                The manufacturer you're looking for doesn't exist or has been deleted.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/manufacturers" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Manufacturers
        </Link>
        <Link href={`/manufacturers/${manufacturer.id}/edit`}>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Manufacturer
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 relative flex-shrink-0">
              {manufacturer.logoAbsoluteUrl ? (
                <ImageWithErrorFallback
                  src={manufacturer.logoAbsoluteUrl}
                  alt={manufacturer.title || "Manufacturer logo"}
                  fill
                  className="object-contain rounded"
                  fallback={<Building className="w-full h-full text-gray-400 p-2" />}
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                  <Building className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">{manufacturer.title}</CardTitle>
              <CardDescription className="mt-1">
                <Badge variant="secondary">{manufacturer.slug}</Badge>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {manufacturer.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{manufacturer.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Car className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">View Models</div>
              <p className="text-sm text-muted-foreground">
                <Link href={`/car-models?manufacturer=${manufacturer.id}`} className="hover:underline">
                  See all car models
                </Link>
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Building className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold">Manufacturer</div>
              <p className="text-sm text-muted-foreground">Car brand information</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}