"use client";

import { useRouter } from "next/navigation";
import { useCreateCarModel, useGetManufacturers } from "@workspace/api";
import { toast } from "sonner";
import {
  CreateCarModelCommand,
  getGetCarModelsQueryKey,
  getGetCarModelByIdQueryKey,
  useQueryClient,
} from "@workspace/api";
import CarModelForm, {
  CarModelFormData,
} from "./car-model-form";

export default function CreateCarModelPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: manufacturersData, isLoading: isLoadingManufacturers } = useGetManufacturers({
    query: {},
  });

  const createCarModelMutation = useCreateCarModel({
    mutation: {
      onSuccess: (data) => {
        toast.success("Car model created successfully!");
        router.push(`/car-models/${data}`);
        queryClient.invalidateQueries({ queryKey: getGetCarModelsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetCarModelByIdQueryKey(data) });
      },
      onError: (error) => {
        toast.error("Failed to create car model: " + error.message);
      },
    },
  });

  const onSubmit = (values: CarModelFormData) => {
    const submissionData: CreateCarModelCommand = {
      name: values.name.trim(),
      slug: values.slug.trim(),
      manufacturerId: values.manufacturerId,
      image: values.image?.trim() || null,
    };

    createCarModelMutation.mutate({ data: submissionData });
  };

  const onCancel = () => {
    router.push("/car-models");
  };

  if (isLoadingManufacturers) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!manufacturersData || manufacturersData.length === 0) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">No manufacturers available</h3>
          <p className="text-muted-foreground mb-4">
            You need to create manufacturers first before you can add car models.
          </p>
          <a href="/manufacturers/create" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
            Create Manufacturer
          </a>
        </div>
      </div>
    );
  }

  return (
    <CarModelForm
      mode="create"
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={createCarModelMutation.isPending}
      submitButtonText="Create Car Model"
      submitButtonLoadingText="Creating..."
      title="Create Car Model"
      description="Create a new car model for your system"
      backButtonText="Back to Car Models"
      backUrl="/car-models"
      manufacturers={manufacturersData}
    />
  );
}