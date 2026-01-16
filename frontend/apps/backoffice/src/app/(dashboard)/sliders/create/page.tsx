"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  useCreateSlider,
  useGetCarListings2,
  useQueryClient,
  getGetSlidersQueryKey,
  SliderPlacement,
} from "@workspace/api";
import { toast } from "sonner";
import SliderForm, { SliderFormData } from "../_components/slider-form";
import SearchParamsSuspense from "@/components/search-params-suspense";

function CreateSliderPageContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const placement = useSearchParams().get("placement");

  const { data: carsData, isLoading: isLoadingCars } = useGetCarListings2();

  const createSliderMutation = useCreateSlider({
    mutation: {
      onSuccess: () => {
        toast.success("Slider created successfully");
        router.push(`/sliders?placement=${placement}`);
        queryClient.invalidateQueries({ queryKey: getGetSlidersQueryKey() });
      },
      onError: (error) => {
        toast.error("Failed to create slider: " + error.message);
      },
    },
  });

  const handleSubmit = (values: SliderFormData) => {
    // Ensure null values are properly handled for the API
    const submitData = {
      ...values,
      bgColor: values.bgColor || null,
      placement: placement
        ? (Number(placement) as any)
        : SliderPlacement.SpecialOffer,
    };
    createSliderMutation.mutate({
      data: submitData,
    });
  };

  const handleCancel = () => {
    router.push(`/sliders?placement=${placement}`);
  };

  if (isLoadingCars) {
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
      mode="create"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={createSliderMutation.isPending}
      submitButtonText="Create Slider"
      submitButtonLoadingText="Creating..."
      title="Create New Slider"
      description="Add a new slider to display on the homepage"
      backButtonText="Back to Sliders"
      backUrl={`/sliders?placement=${placement}`}
      cars={carsData?.items || []}
    />
  );
}

export default function CreateSliderPage() {
  return (
    <SearchParamsSuspense>
      <CreateSliderPageContent />
    </SearchParamsSuspense>
  );
}
