"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCreateCarOption, useGetCarOptions } from "@workspace/api";
import { toast } from "sonner";
import {
  CreateCarOptionCommand,
  getGetCarOptionsQueryKey,
  useQueryClient,
} from "@workspace/api";
import CarOptionForm, {
  CarOptionFormSubmissionData,
} from "./car-option-form";
import SearchParamsSuspense from "@/components/search-params-suspense";

function CreateCarOptionPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const parentId = searchParams.get("parentId");

  const { data: carOptionsData } = useGetCarOptions({});

  const createCarOptionMutation = useCreateCarOption({
    mutation: {
      onSuccess: (data) => {
        toast.success("Car option created successfully!");
        router.push(`/car-options/${data}`);
        queryClient.invalidateQueries({
          queryKey: getGetCarOptionsQueryKey(),
        });
      },
      onError: (error) => {
        toast.error("Failed to create car option: " + error.message);
      },
    },
  });

  const onSubmit = (values: CarOptionFormSubmissionData) => {
    const submissionData: CreateCarOptionCommand = {
      name: values.name.trim(),
      slug: values.slug.trim(),
      description: values.description?.trim() || null,
      type: values.type,
      image: values.image?.trim() || null,
      icon: values.icon?.trim() || null,
      parentId: parentId ? parseInt(parentId) : null,
    };

    createCarOptionMutation.mutate({ data: submissionData });
  };

  const onCancel = () => {
    router.push("/car-options");
  };

  const getParentName = () => {
    if (!parentId || !carOptionsData) return undefined;

    const findOptionById = (options: any[], id: number): any => {
      for (const opt of options) {
        if (opt.id === id) return opt;
        if (opt.children) {
          const found = findOptionById(opt.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const parent = findOptionById(carOptionsData, parseInt(parentId));
    return parent?.name;
  };

  return (
    <CarOptionForm
      mode="create"
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={createCarOptionMutation.isPending}
      submitButtonText="Create Option"
      submitButtonLoadingText="Creating..."
      title={parentId ? "Create Child Option" : "Create Car Option"}
      description={
        parentId
          ? "Create a new child car option"
          : "Create a new car option for your system"
      }
      backButtonText="Back to Options"
      backUrl="/car-options"
      parentName={getParentName()}
      hasParent={!!parentId}
    />
  );
}

export default function CreateCarOptionPage() {
  return (
    <SearchParamsSuspense>
      <CreateCarOptionPageContent />
    </SearchParamsSuspense>
  );
}