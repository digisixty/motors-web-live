"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCreateCarAttribute, useGetCarAttributes } from "@workspace/api";
import { toast } from "sonner";
import {
  CreateCarAttributeCommand,
  getGetCarAttributesQueryKey,
  useQueryClient,
} from "@workspace/api";
import CarAttributeForm, {
  CarAttributeFormSubmissionData,
} from "./car-attribute-form";
import SearchParamsSuspense from "@/components/search-params-suspense";

function CreateCarAttributePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const parentId = searchParams.get("parentId");

  const { data: carAttributesData } = useGetCarAttributes({});

  const createCarAttributeMutation = useCreateCarAttribute({
    mutation: {
      onSuccess: (data) => {
        toast.success("Car attribute created successfully!");
        router.push(`/car-attributes/${data}`);
        queryClient.invalidateQueries({
          queryKey: getGetCarAttributesQueryKey(),
        });
      },
      onError: (error) => {
        toast.error("Failed to create car attribute: " + error.message);
      },
    },
  });

  const onSubmit = (values: CarAttributeFormSubmissionData) => {
    const submissionData: CreateCarAttributeCommand = {
      name: values.name.trim(),
      slug: values.slug.trim(),
      description: values.description?.trim() || null,
      type: values.type,
      image: values.image?.trim() || null,
      icon: values.icon?.trim() || null,
      parentId: parentId ? parseInt(parentId) : null,
    };

    createCarAttributeMutation.mutate({ data: submissionData });
  };

  const onCancel = () => {
    router.push("/car-attributes");
  };

  const getParentName = () => {
    if (!parentId || !carAttributesData) return undefined;

    const findAttributeById = (attributes: any[], id: number): any => {
      for (const attr of attributes) {
        if (attr.id === id) return attr;
        if (attr.children) {
          const found = findAttributeById(attr.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const parent = findAttributeById(carAttributesData, parseInt(parentId));
    return parent?.name;
  };

  return (
    <CarAttributeForm
      mode="create"
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={createCarAttributeMutation.isPending}
      submitButtonText="Create Attribute"
      submitButtonLoadingText="Creating..."
      title={parentId ? "Create Child Attribute" : "Create Car Attribute"}
      description={
        parentId
          ? "Create a new child car attribute"
          : "Create a new car attribute for your system"
      }
      backButtonText="Back to Attributes"
      backUrl="/car-attributes"
      parentName={getParentName()}
      hasParent={!!parentId}
    />
  );
}

export default function CreateCarAttributePage() {
  return (
    <SearchParamsSuspense>
      <CreateCarAttributePageContent />
    </SearchParamsSuspense>
  );
}
