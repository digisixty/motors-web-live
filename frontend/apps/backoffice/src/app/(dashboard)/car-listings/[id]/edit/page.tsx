"use client";

import { useRouter } from "next/navigation";
import { useGetCarListingById, useUpdateCarListing } from "@workspace/api";
import { toast } from "sonner";
import {
  UpdateCarListingCommand,
  getGetCarListingByIdQueryKey,
  useQueryClient,
} from "@workspace/api";
import { Skeleton } from "@/components/ui/skeleton";
import CarListingForm, {
  CarListingFormSubmissionData,
} from "../../_components/car-listing-form";
import { useState, useEffect } from "react";

export default function EditCarListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [carId, setCarId] = useState<number | null>(null);
  const [isResolvingParams, setIsResolvingParams] = useState(true);

  useEffect(() => {
    params.then((p) => {
      const id = parseInt(p.id);
      if (!isNaN(id)) {
        setCarId(id);
      }
      setIsResolvingParams(false);
    });
  }, [params]);

  // Use the proper single car API
  const {
    data: car,
    isLoading,
    error,
    refetch,
  } = useGetCarListingById(carId!, {
    query: {
      enabled: carId !== null && !isNaN(carId),
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      retry: 2,
    },
  });

  const updateCarListingMutation = useUpdateCarListing({
    mutation: {
      onSuccess: () => {
        toast.success("Car listing updated successfully!");
        if (carId) {
          router.push(`/car-listings/${carId}`);
        } else {
          router.push("/car-listings");
        }
        if (carId) {
          queryClient.invalidateQueries({
            queryKey: getGetCarListingByIdQueryKey(carId),
          });
        }
      },
      onError: (error) => {
        toast.error("Failed to update car listing: " + error.message);
      },
    },
  });

  const onSubmit = (values: CarListingFormSubmissionData) => {
    if (!carId) return;

    // Combine interior and exterior gallery images into comma-separated strings
    const interiorGalleryImages = (values.interiorImagesGallery || [])
      .filter(Boolean)
      .join(",");
    const exteriorGalleryImages = (values.exteriorImagesGallery || [])
      .filter(Boolean)
      .join(",");

    const submissionData: UpdateCarListingCommand = {
      id: carId,
      slug: values.slug?.trim() || null,
      vinNumber: values.vinNumber?.trim() || null,
      registrationDate: values.registrationDate || null,
      primaryImage: values.primaryImage?.trim() || null,
      manufacturerId: values.manufacturerId || null,
      carModelId: values.carModelId || null,
      interiorImages: interiorGalleryImages || null,
      exteriorImages: exteriorGalleryImages || null,
      videos: values.videos || null,
      price: values.price || null,
      salePrice: values.salePrice || null,
      isSold: values.isSold,
      customPriceLabel: values.customPriceLabel?.trim() || null,
      cardFooterLabel: values.cardFooterLabel?.trim() || null,
      isSpecialOffer: values.isSpecialOffer,
      description: values.description?.trim() || null,
      metaTags: values.metaTags || null,
      carAttributes:
        values.carAttributes
          ?.filter((a) => a.value && a.value !== "false" && a?.value !== null)
          ?.map((attr) => ({
            carAttributeId: attr.carAttributeId,
            value: attr.value || null,
          })) || [],
      carOptions:
        values.carOptions
          ?.filter((a) => a.value && a.value !== "false" && a?.value !== null)
          ?.map((option) => ({
            carOptionId: option.carOptionId,
            value: option.value || null,
          })) || [],
    };

    updateCarListingMutation.mutate({ id: carId, data: submissionData });
  };

  const onCancel = () => {
    if (carId) {
      router.push(`/car-listings/${carId}`);
    } else {
      router.push("/car-listings");
    }
  };

  if (isResolvingParams) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="mb-6">
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-8 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (carId === null) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">Invalid car ID</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">
          Error loading car listing: {error.message}
        </div>
      </div>
    );
  }

  if (isLoading || !car) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="mb-6">
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-8 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <CarListingForm
      mode="edit"
      initialData={{
        slug: car.slug || undefined,
        stockNumber: car.stockNumber,
        vinNumber: car.vinNumber || undefined,
        registrationDate: car.registrationDate || undefined,
        primaryImage: car.primaryImage || undefined,
        manufacturerId: car.manufacturerId || undefined,
        carModelId: car.carModelId || undefined,
        primaryImageAbsoluteUrl: car.primaryImageAbsoluteUrl || undefined,
        interiorImages: car.interiorImages || undefined,
        exteriorImages: car.exteriorImages || undefined,
        videos: car.videos || undefined,
        price: car.price || undefined,
        salePrice: car.salePrice || undefined,
        isSold: car.isSold,
        customPriceLabel: car.customPriceLabel || undefined,
        cardFooterLabel: car.cardFooterLabel || undefined,
        isSpecialOffer: car.isSpecialOffer,
        description: car.description || undefined,
        interiorImagesGallery: car.interiorImages
          ? car.interiorImages.split(",").map((url) => url.trim())
          : [],
        exteriorImagesGallery: car.exteriorImages
          ? car.exteriorImages.split(",").map((url) => url.trim())
          : [],
        absoluteInteriorImagesGallery: car.absoluteInteriorImages || [],
        absoluteExteriorImagesGallery: car.absoluteExteriorImages || [],
        absoluteVideos: car.absoluteVideos,
        carAttributes:
          car.carListingAttributes?.map((attr) => ({
            carAttributeId: attr.carAttributeId!,
            carAttributeName: attr.carAttributeName || "",
            carAttributeSlug:
              attr.carAttributeSlug || attr.carAttributeName || "",
            value: attr.value || "",
          })) || [],
        carOptions:
          car.carListingOptions?.map((option) => ({
            carOptionId: option.carOptionId!,
            carOptionName: option.carOptionName || "",
            carOptionSlug: option.carOptionSlug || option.carOptionName || "",
            value: option.value || "",
          })) || [],
        metaTags: car.metaTags || undefined,
      }}
      isLoading={isLoading}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={updateCarListingMutation.isPending}
      submitButtonText="Update Car"
      submitButtonLoadingText="Updating..."
      title="Edit Car Listing"
      description="Update the details of this car listing"
      backButtonText="Back to Car"
      backUrl={carId ? `/car-listings/${carId}` : "/car-listings"}
      showViewButton={true}
      viewUrl={carId ? `/car-listings/${carId}` : "/car-listings"}
    />
  );
}
