"use client";

import { useRouter } from "next/navigation";
import { useCreateManufacturer } from "@workspace/api";
import { toast } from "sonner";
import {
  CreateManufacturerCommand,
  getGetManufacturersQueryKey,
  getGetManufacturerByIdQueryKey,
  useQueryClient,
} from "@workspace/api";
import ManufacturerForm, {
  ManufacturerFormData,
} from "./manufacturer-form";

export default function CreateManufacturerPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createManufacturerMutation = useCreateManufacturer({
    mutation: {
      onSuccess: (data) => {
        toast.success("Manufacturer created successfully!");
        router.push(`/manufacturers/${data}`);
        queryClient.invalidateQueries({ queryKey: getGetManufacturersQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetManufacturerByIdQueryKey(data) });
      },
      onError: (error) => {
        toast.error("Failed to create manufacturer: " + error.message);
      },
    },
  });

  const onSubmit = (values: ManufacturerFormData) => {
    const submissionData: CreateManufacturerCommand = {
      title: values.title.trim(),
      slug: values.slug.trim(),
      description: values.description?.trim() || null,
      logo: values.logo?.trim() || null,
    };

    createManufacturerMutation.mutate({ data: submissionData });
  };

  const onCancel = () => {
    router.push("/manufacturers");
  };

  return (
    <ManufacturerForm
      mode="create"
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={createManufacturerMutation.isPending}
      submitButtonText="Create Manufacturer"
      submitButtonLoadingText="Creating..."
      title="Create Manufacturer"
      description="Create a new car manufacturer for your system"
      backButtonText="Back to Manufacturers"
      backUrl="/manufacturers"
    />
  );
}