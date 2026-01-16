"use client";

import { useRouter } from "next/navigation";
import { useCreateBlog } from "@workspace/api";
import { toast } from "sonner";
import {
  CreateBlogCommand,
  getGetBlogsListQueryKey,
  useQueryClient,
} from "@workspace/api";
import BlogForm, { BlogFormSubmissionData } from "./blog-form";

export default function CreateBlogPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createBlogMutation = useCreateBlog({
    mutation: {
      onSuccess: (data) => {
        toast.success("Blog created successfully!");
        router.push(`/blogs/${data}`);
        queryClient.invalidateQueries({ queryKey: getGetBlogsListQueryKey() });
      },
      onError: (error) => {
        toast.error("Failed to create blog: " + error.message);
      },
    },
  });

  const onSubmit = (values: BlogFormSubmissionData) => {
    const submissionData: CreateBlogCommand = {
      title: values.title.trim(),
      slug: values.slug.trim(),
      shortDescription: values.shortDescription?.trim() || null,
      fullDescription: values.fullDescription?.trim() || null,
      coverImage: values.coverImage?.trim() || null,
      imagesGallery:
        values?.imagesGallery && values.imagesGallery.length > 0 ? values.imagesGallery : null,
      videosGallery:
        values?.videosGallery && values.videosGallery.length > 0 ? values.videosGallery : null,
      metaTags: values.metaTags?.trim() || null,
    };

    createBlogMutation.mutate({ data: submissionData });
  };

  const onCancel = () => {
    router.push("/blogs");
  };

  return (
    <BlogForm
      mode="create"
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={createBlogMutation.isPending}
      submitButtonText="Create Blog"
      submitButtonLoadingText="Creating..."
      title="Create Blog Post"
      description="Create a new blog post for your website"
      backButtonText="Back to Blogs"
      backUrl="/blogs"
    />
  );
}
