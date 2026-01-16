"use client";

import { useRouter } from "next/navigation";
import {
  useGetBlog,
  useUpdateBlog,
  getGetBlogsListQueryKey,
  getGetBlogQueryKey,
  useQueryClient,
} from "@workspace/api";
import { toast } from "sonner";
import type { UpdateBlogCommand } from "@workspace/api";
import BlogForm, { BlogFormSubmissionData } from "./blog-form";

export default function EditBlogPage({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const blogId = parseInt(id);

  const {
    data: blog,
    isLoading: isLoadingBlog,
    error: blogError,
  } = useGetBlog(blogId, {
    query: {
      enabled: !isNaN(blogId),
    },
  });

  const updateBlogMutation = useUpdateBlog({
    mutation: {
      onSuccess: () => {
        // Invalidate blogs list query
        queryClient.invalidateQueries({ queryKey: getGetBlogsListQueryKey() });

        // Invalidate the specific blog query
        queryClient.invalidateQueries({ queryKey: getGetBlogQueryKey(blogId) });

        toast.success("Blog updated successfully!");
        router.push(`/blogs/${blogId}`);
      },
      onError: (error) => {
        toast.error("Failed to update blog: " + error.message);
      },
    },
  });

  const handleSubmit = (values: BlogFormSubmissionData) => {
    const submissionData: UpdateBlogCommand = {
      id: blogId,
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

    updateBlogMutation.mutate({ id: blogId, data: submissionData });
  };

  const onCancel = () => {
    router.push(`/blogs/${blogId}`);
  };

  if (isNaN(blogId)) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">Invalid blog ID</div>
      </div>
    );
  }

  if (blogError) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">
          Error loading blog: {blogError.message}
        </div>
      </div>
    );
  }

  const initialData = blog
    ? {
        title: blog.title || "",
        slug: blog.slug || "",
        shortDescription: blog.shortDescription || "",
        fullDescription: blog.fullDescription || "",
        coverImage: blog.coverImage || "",
        coverImageAbsoluteUrl: blog.coverImageAbsoluteUrl || "",
        metaTags: blog.metaTags || "",
        metaTagsObject: blog.metaTagsObject || undefined,
        imagesGallery: blog.imagesGallery || [],
        absoluteImagesGallery: blog.imagesGalleryAbsoluteUrls || [],
        videosGallery: blog.videosGallery || [],
      }
    : undefined;

  return (
    <BlogForm
      mode="edit"
      initialData={initialData}
      isLoading={isLoadingBlog}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isSubmitting={updateBlogMutation.isPending}
      submitButtonText="Update Blog"
      submitButtonLoadingText="Updating..."
      title="Edit Blog Post"
      description="Update the details of this blog post"
      backButtonText="Back to Blog"
      backUrl={`/blogs/${blogId}`}
      showViewButton={true}
      viewUrl={`/blogs/${blogId}`}
    />
  );
}
