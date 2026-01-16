"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetCarModelById, useUpdateCarModel, useGetManufacturers } from "@workspace/api";
import { toast } from "sonner";
import {
  UpdateCarModelCommand,
  getGetCarModelsQueryKey,
  getGetCarModelByIdQueryKey,
  useQueryClient,
} from "@workspace/api";
import { Card, CardContent } from "@/components/ui/card";
import CarModelForm, {
  CarModelFormData,
} from "./car-model-form";

export default function EditCarModelPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = parseInt(params.id as string);

  const {
    data: carModel,
    isLoading: isLoadingCarModel,
    error: carModelError,
  } = useGetCarModelById(id, {
    query: {
      enabled: !!id,
    },
  });

  const {
    data: manufacturersData,
    isLoading: isLoadingManufacturers,
  } = useGetManufacturers({
    query: {},
  });

  const updateCarModelMutation = useUpdateCarModel({
    mutation: {
      onSuccess: () => {
        toast.success("Car model updated successfully!");
        router.push(`/car-models/${id}`);
        queryClient.invalidateQueries({ queryKey: getGetCarModelsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetCarModelByIdQueryKey(id) });
      },
      onError: (error) => {
        toast.error("Failed to update car model: " + error.message);
      },
    },
  });

  const onSubmit = (values: CarModelFormData) => {
    const submissionData: UpdateCarModelCommand = {
      id: id,
      name: values.name.trim(),
      slug: values.slug.trim(),
      manufacturerId: values.manufacturerId,
      image: values.image?.trim() || null,
    };

    updateCarModelMutation.mutate({ id, data: submissionData });
  };

  const onCancel = () => {
    router.push(`/car-models/${id}`);
  };

  if (isLoadingCarModel || isLoadingManufacturers) {
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

  if (carModelError) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading car model: {carModelError.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!carModel) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              Car model not found
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!manufacturersData || manufacturersData.length === 0) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">No manufacturers available</h3>
          <p className="text-muted-foreground mb-4">
            You need to have manufacturers to edit car models.
          </p>
          <a href="/manufacturers/create" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
            Create Manufacturer
          </a>
        </div>
      </div>
    );
  }

  const initialData = carModel
    ? {
        name: carModel.name || "",
        slug: carModel.slug || "",
        manufacturerId: carModel.manufacturerId || 0,
        image: carModel.image || "",
        imageAbsoluteUrl: carModel.imageAbsoluteUrl || "",
      }
    : undefined;

  return (
    <CarModelForm
      mode="edit"
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={updateCarModelMutation.isPending}
      submitButtonText="Update Car Model"
      submitButtonLoadingText="Updating..."
      title="Edit Car Model"
      description="Update the car model information"
      backButtonText="Back to Car Model"
      backUrl={`/car-models/${id}`}
      initialData={initialData}
      manufacturers={manufacturersData}
    />
  );
}