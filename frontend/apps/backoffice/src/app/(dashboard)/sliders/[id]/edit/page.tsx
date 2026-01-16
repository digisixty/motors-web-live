"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  useGetSliderById,
  useUpdateSlider,
  useGetCarListings2,
  useQueryClient,
  getGetSlidersQueryKey,
  getGetSliderByIdQueryKey,
} from "@workspace/api";
import { toast } from "sonner";
import SliderForm, { SliderFormData } from "../../_components/slider-form";
import SearchParamsSuspense from "@/components/search-params-suspense";

function EditSliderPageContent() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const sliderId = parseInt(params.id as string);
  const placement = useSearchParams().get("placement");

  const {
    data: sliderData,
    isLoading: isLoadingSlider,
    error: sliderError,
  } = useGetSliderById(sliderId);

  const { data: carsData, isLoading: isLoadingCars } = useGetCarListings2();

  const updateSliderMutation = useUpdateSlider({
    mutation: {
      onSuccess: () => {
        toast.success("Slider updated successfully");
        router.push(`/sliders?placement=${placement}`);
        queryClient.invalidateQueries({ queryKey: getGetSlidersQueryKey() });
        queryClient.invalidateQueries({
          queryKey: getGetSliderByIdQueryKey(sliderId),
        });
      },
      onError: (error) => {
        toast.error("Failed to update slider: " + error.message);
      },
    },
  });

  const handleSubmit = (values: SliderFormData) => {
    // Ensure null values are properly handled for the API
    const submitData = {
      id: sliderId,
      ...values,
      bgColor: values.bgColor || null,
      placement: sliderData?.placement,
    };
    updateSliderMutation.mutate({
      id: sliderId,
      data: submitData,
    });
  };

  const handleCancel = () => {
    router.push(`/sliders?placement=${placement}`);
  };

  if (sliderError) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center text-red-600">
            Error loading slider: {sliderError.message}
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingSlider || isLoadingCars) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SliderForm
      mode="edit"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={updateSliderMutation.isPending}
      submitButtonText="Update Slider"
      submitButtonLoadingText="Updating..."
      title="Edit Slider"
      description="Update the slider information and appearance"
      backButtonText="Back to Sliders"
      backUrl={`/sliders?placement=${placement}`}
      initialData={
        sliderData
          ? {
              ...sliderData,
              imageAbsoluteUrl: sliderData.imageAbsoluteUrl || undefined,
              videoAbsoluteUrl: sliderData.videoAbsoluteUrl || undefined,
            }
          : undefined
      }
      cars={carsData?.items || []}
    />
  );
}

export default function EditSliderPage() {
  return (
    <SearchParamsSuspense>
      <EditSliderPageContent />
    </SearchParamsSuspense>
  );
}
