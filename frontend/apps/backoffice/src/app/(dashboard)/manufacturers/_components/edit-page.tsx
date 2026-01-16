"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetManufacturerById, useUpdateManufacturer } from "@workspace/api";
import { toast } from "sonner";
import {
  UpdateManufacturerCommand,
  getGetManufacturersQueryKey,
  getGetManufacturerByIdQueryKey,
  useQueryClient,
} from "@workspace/api";
import { Card, CardContent } from "@/components/ui/card";
import ManufacturerForm, {
  ManufacturerFormData,
} from "./manufacturer-form";

export default function EditManufacturerPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = parseInt(params.id as string);

  const {
    data: manufacturer,
    isLoading: isLoadingManufacturer,
    error: manufacturerError,
  } = useGetManufacturerById(id, {
    query: {
      enabled: !!id,
    },
  });

  const updateManufacturerMutation = useUpdateManufacturer({
    mutation: {
      onSuccess: () => {
        toast.success("Manufacturer updated successfully!");
        router.push(`/manufacturers/${id}`);
        queryClient.invalidateQueries({ queryKey: getGetManufacturersQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetManufacturerByIdQueryKey(id) });
      },
      onError: (error) => {
        toast.error("Failed to update manufacturer: " + error.message);
      },
    },
  });

  const onSubmit = (values: ManufacturerFormData) => {
    const submissionData: UpdateManufacturerCommand = {
      id: id,
      title: values.title.trim(),
      slug: values.slug.trim(),
      description: values.description?.trim() || null,
      logo: values.logo?.trim() || null,
    };

    updateManufacturerMutation.mutate({ id, data: submissionData });
  };

  const onCancel = () => {
    router.push(`/manufacturers/${id}`);
  };

  if (isLoadingManufacturer) {
    return <div className="container mx-auto py-8 max-w-2xl">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    </div>;
  }

  if (manufacturerError) {
    return <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Error loading manufacturer: {manufacturerError.message}
          </div>
        </CardContent>
      </Card>
    </div>;
  }

  if (!manufacturer) {
    return <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            Manufacturer not found
          </div>
        </CardContent>
      </Card>
    </div>;
  }

  const initialData = manufacturer
    ? {
        title: manufacturer.title || "",
        slug: manufacturer.slug || "",
        description: manufacturer.description || "",
        logo: manufacturer.logo || "",
        logoAbsoluteUrl: manufacturer.logoAbsoluteUrl || "",
      }
    : undefined;

  return (
    <ManufacturerForm
      mode="edit"
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={updateManufacturerMutation.isPending}
      submitButtonText="Update Manufacturer"
      submitButtonLoadingText="Updating..."
      title="Edit Manufacturer"
      description="Update the manufacturer information"
      backButtonText="Back to Manufacturer"
      backUrl={`/manufacturers/${id}`}
      initialData={initialData}
    />
  );
}