"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateStaticContent,
  useQueryClient,
  getGetStaticContentsQueryKey,
  getGetStaticContentByIdQueryKey,
} from "@workspace/api";
import { toast } from "sonner";
import StaticContentForm, {
  type StaticContentFormData,
} from "../_components/static-content-form";

function CreateStaticContentPageContent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createStaticContentMutation = useCreateStaticContent({
    mutation: {
      onSuccess: (data) => {
        toast.success("Static content created successfully");
        router.push(`/static-contents/${data}`);
        queryClient.invalidateQueries({ queryKey: getGetStaticContentsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStaticContentByIdQueryKey(data) });
      },
      onError: (error) => {
        toast.error("Failed to create static content: " + error.message);
      },
    },
  });

  const handleSubmit = (values: StaticContentFormData) => {
    createStaticContentMutation.mutate({
      data: {
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

  return (
    <StaticContentForm
      mode="create"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={createStaticContentMutation.isPending}
      submitButtonText="Create Static Content"
      submitButtonLoadingText="Creating..."
      title="Create Static Content"
      description="Add a new static content page to your website"
      backButtonText="Back to Static Contents"
      backUrl="/static-contents"
    />
  );
}

export default function CreateStaticContentPage() {
  return <CreateStaticContentPageContent />;
}
