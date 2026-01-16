"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useGetStaticContentById,
  useUpdateStaticContent,
  useQueryClient,
  getGetStaticContentsQueryKey,
  getGetStaticContentByIdQueryKey,
} from "@workspace/api";
import { toast } from "sonner";
import StaticContentForm, {
  type StaticContentFormData,
} from "../../_components/static-content-form";
import { Skeleton } from "@/components/ui/skeleton";

function EditStaticContentPageContent() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);
  const queryClient = useQueryClient();

  const { data: staticContentData, isLoading: isLoadingStaticContent } =
    useGetStaticContentById(id);

  const updateStaticContentMutation = useUpdateStaticContent({
    mutation: {
      onSuccess: () => {
        toast.success("Static content updated successfully");
        router.push(`/static-contents/${id}`);
        queryClient.invalidateQueries({ queryKey: getGetStaticContentsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStaticContentByIdQueryKey(id) });
      },
      onError: (error) => {
        toast.error("Failed to update static content: " + error.message);
      },
    },
  });

  const handleSubmit = (values: StaticContentFormData) => {
    updateStaticContentMutation.mutate({
      id,
      data: {
        id,
        title: values.title,
        mainImage: values.mainImage ?? null,
        description: values.description,
        slug: values.slug,
      },
    });
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoadingStaticContent) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <StaticContentForm
      mode="edit"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={updateStaticContentMutation.isPending}
      submitButtonText="Update Static Content"
      submitButtonLoadingText="Updating..."
      title="Edit Static Content"
      description="Update the static content page details"
      backButtonText="Back to Static Contents"
      backUrl="/static-contents"
      initialData={{
        title: staticContentData?.title,
        mainImage: staticContentData?.mainImage,
        mainImageAbsoluteUrl: staticContentData?.mainImageAbsoluteUrl ?? undefined,
        description: staticContentData?.description,
        slug: staticContentData?.slug,
      }}
    />
  );
}

export default function EditStaticContentPage() {
  return <EditStaticContentPageContent />;
}
