"use client";

import { useRouter } from "next/navigation";
import { useCreateCarListing } from "@workspace/api";
import { toast } from "sonner";
import {
  CreateCarListingCommand,
  getGetCarListingsQueryKey,
  useQueryClient,
} from "@workspace/api";
import CarListingForm, {
  CarListingFormSubmissionData,
} from "../_components/car-listing-form";

export default function CreateCarListingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createCarListingMutation = useCreateCarListing({
    mutation: {
      onSuccess: (data) => {
        toast.success("Car listing created successfully!");
        router.push(`/car-listings/${data}`);
        queryClient.invalidateQueries({
          queryKey: getGetCarListingsQueryKey(),
        });
      },
      onError: (error) => {
        toast.error("Failed to create car listing: " + error.message);
      },
    },
  });

  const onSubmit = (values: CarListingFormSubmissionData) => {
    // Combine interior and exterior gallery images into comma-separated strings
    const interiorGalleryImages = (values.interiorImagesGallery || [])
      .filter(Boolean)
      .join(",");
    const exteriorGalleryImages = (values.exteriorImagesGallery || [])
      .filter(Boolean)
      .join(",");

    const submissionData: CreateCarListingCommand = {
      vinNumber: values.vinNumber?.trim() || null,
      registrationDate: values.registrationDate || null,
      manufacturerId: values.manufacturerId || null,
      carModelId: values.carModelId || null,
      primaryImage: values.primaryImage?.trim() || null,
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

    createCarListingMutation.mutate({ data: submissionData });
  };

  const onCancel = () => {
    router.push("/car-listings");
  };

  return (
    <CarListingForm
      mode="create"
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={createCarListingMutation.isPending}
      submitButtonText="Add Car"
      submitButtonLoadingText="Adding..."
      title="Add Car to Inventory"
      description="Create a new car listing for your inventory"
      backButtonText="Back to Car Listings"
      backUrl="/car-listings"
    />
  );
}
