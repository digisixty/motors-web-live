"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetCarModelById } from "@workspace/api";
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
  ArrowLeft,
  Edit,
  Car,
  Building,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import ImageWithErrorFallback from "@/components/ui/image-with-error-fallback";

export default function CarModelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const {
    data: carModel,
    isLoading,
    error,
  } = useGetCarModelById(id, {
    query: {
      enabled: !!id,
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="mb-6">
          <Link
            href="/car-models"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Car Models
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
          <Link
            href="/car-models"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Car Models
          </Link>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading car model: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!carModel) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="mb-6">
          <Link
            href="/car-models"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Car Models
          </Link>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Car model not found
              </h3>
              <p className="text-muted-foreground">
                The car model you're looking for doesn't exist or has been
                deleted.
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
        <Link
          href="/car-models"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Car Models
        </Link>
        <Link href={`/car-models/${carModel.id}/edit`}>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Car Model
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="w-32 h-24 relative flex-shrink-0">
              {carModel.imageAbsoluteUrl ? (
                <ImageWithErrorFallback
                  src={carModel.imageAbsoluteUrl}
                  alt={carModel.name || "Car model image"}
                  fill
                  className="object-cover rounded"
                  fallback={<Car className="w-full h-full text-gray-400 p-4" />}
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                  <Car className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">{carModel.name}</CardTitle>
              <CardDescription className="mt-1">
                <Badge variant="secondary">{carModel.slug}</Badge>
              </CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Building className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-muted-foreground">
                  {carModel.manufacturerName || "Unknown Manufacturer"}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Car className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">Car Model</div>
              <p className="text-sm text-muted-foreground">
                Vehicle information
              </p>
            </div>
            <div className="text-center p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Building className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-lg font-bold">
                {carModel.manufacturerName || "Manufacturer"}
              </div>
              <p className="text-sm text-muted-foreground">
                <Link
                  href={`/manufacturers/${carModel.manufacturerId}`}
                  className="hover:underline"
                >
                  View manufacturer
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
