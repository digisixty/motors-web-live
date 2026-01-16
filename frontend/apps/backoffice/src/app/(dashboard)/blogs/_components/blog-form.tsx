"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";
import { SingleImageSelector } from "@/components/single-image-selector";
import { MultipleImageSelector } from "@/components/multiple-image-selector";
import RichTextEditor from "@/components/rich-text-editor";

// SEO meta tags interface
interface SeoMetaTags {
  title?: string;
  description?: string;
  keywords?: string;
  // ogTitle?: string;
  // ogDescription?: string;
  // ogImage?: string;
  // twitterCard?: string;
  // twitterTitle?: string;
  // twitterDescription?: string;
  // twitterImage?: string;
  // canonical?: string;
  // robots?: string;
  author?: string;
}

// Form schema with Zod
const blogFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  coverImage: z.string().optional(),
  // SEO fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  // ogTitle: z.string().optional(),
  // ogDescription: z.string().optional(),
  // ogImage: z.string().optional(),
  // twitterCard: z.string().optional(),
  // twitterTitle: z.string().optional(),
  // twitterDescription: z.string().optional(),
  // twitterImage: z.string().optional(),
  // canonical: z.string().optional(),
  // robots: z.string().optional(),
  author: z.string().optional(),
  // Legacy metaTags for server compatibility
  metaTags: z.string().optional(),
  imagesGallery: z.array(z.string()).optional(),
  videosGallery: z.array(z.string()).optional(),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;

export interface BlogFormSubmissionData {
  title: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  coverImage?: string;
  metaTags?: string;
  imagesGallery?: string[];
  videosGallery?: string[];
}

export interface BlogFormProps {
  mode: "create" | "edit";
  initialData?: {
    title?: string;
    slug?: string;
    shortDescription?: string;
    fullDescription?: string;
    coverImage?: string;
    coverImageAbsoluteUrl?: string;
    metaTags?: string;
    metaTagsObject?: SeoMetaTags;
    imagesGallery?: string[];
    absoluteImagesGallery?: string[];
    videosGallery?: string[];
  };
  isLoading?: boolean;
  onSubmit: (values: BlogFormSubmissionData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  submitButtonLoadingText?: string;
  title?: string;
  description?: string;
  backButtonText?: string;
  backUrl?: string;
  showViewButton?: boolean;
  viewUrl?: string;
}

// Helper function to extract SEO fields from metaTagsObject
const extractSeoFields = (
  metaTagsObject?: SeoMetaTags | any
): Partial<BlogFormValues> => {
  if (!metaTagsObject || typeof metaTagsObject !== "object") return {};

  // Debug: log the metaTagsObject to see what we're getting
  console.log("Extracting SEO fields from:", metaTagsObject);

  return {
    metaTitle: metaTagsObject.title || "",
    metaDescription: metaTagsObject.description || "",
    metaKeywords: metaTagsObject.keywords || "",
    // ogTitle: metaTagsObject.ogTitle || "",
    // ogDescription: metaTagsObject.ogDescription || "",
    // ogImage: metaTagsObject.ogImage || "",
    // twitterCard: metaTagsObject.twitterCard || "summary_large_image",
    // twitterTitle: metaTagsObject.twitterTitle || "",
    // twitterDescription: metaTagsObject.twitterDescription || "",
    // twitterImage: metaTagsObject.twitterImage || "",
    // canonical: metaTagsObject.canonical || "",
    // robots: metaTagsObject.robots || "index,follow",
    author: metaTagsObject.author || "",
  };
};

// Helper function to convert SEO fields to metaTags string
const createMetaTagsString = (values: BlogFormValues): string => {
  const seoMetaTags: SeoMetaTags = {
    title: values.metaTitle,
    description: values.metaDescription,
    keywords: values.metaKeywords,
    // ogTitle: values.ogTitle,
    // ogDescription: values.ogDescription,
    // ogImage: values.ogImage,
    // twitterCard: values.twitterCard,
    // twitterTitle: values.twitterTitle,
    // twitterDescription: values.twitterDescription,
    // twitterImage: values.twitterImage,
    // canonical: values.canonical,
    // robots: values.robots,
    author: values.author,
  };

  // Remove undefined values
  const cleanMetaTags = Object.fromEntries(
    Object.entries(seoMetaTags).filter(
      ([_, value]) => value !== undefined && value !== ""
    )
  );

  return Object.keys(cleanMetaTags).length > 0
    ? JSON.stringify(cleanMetaTags)
    : "";
};

export default function BlogForm({
  mode,
  initialData,
  isLoading = false,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitButtonText,
  submitButtonLoadingText,
  title,
  description,
  backButtonText,
  backUrl,
  showViewButton = false,
  viewUrl,
}: BlogFormProps) {
  // Extract SEO fields from metaTagsObject if available
  const extractedSeoFields = extractSeoFields(initialData?.metaTagsObject);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      shortDescription: initialData?.shortDescription || "",
      fullDescription: initialData?.fullDescription || "",
      coverImage: initialData?.coverImage || undefined,
      metaTags: initialData?.metaTags || "",
      imagesGallery: initialData?.imagesGallery || [],
      videosGallery: initialData?.videosGallery || [],
      // SEO fields with extracted values or defaults
      ...extractedSeoFields,
    },
    mode: "onBlur",
  });

  const watchTitle = form.watch("title");

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Auto-generate slug when title changes and slug hasn't been manually touched
  useEffect(() => {
    if (watchTitle && !form.formState.touchedFields.slug) {
      const generatedSlug = generateSlug(watchTitle);
      form.setValue("slug", generatedSlug);
    }
  }, [watchTitle, form]);

  // Update form values when initialData changes (important for edit mode)
  useEffect(() => {
    if (initialData && mode === "edit") {
      const seoFields = extractSeoFields(initialData.metaTagsObject);
      form.reset({
        title: initialData.title || "",
        slug: initialData.slug || "",
        shortDescription: initialData.shortDescription || "",
        fullDescription: initialData.fullDescription || "",
        coverImage: initialData.coverImage || undefined,
        metaTags: initialData.metaTags || "",
        imagesGallery: initialData.imagesGallery || [],
        videosGallery: initialData.videosGallery || [],
        ...seoFields,
      });
    }
  }, [initialData, mode, form]);

  const onFormSubmit = (values: BlogFormValues) => {
    // Convert SEO fields to metaTags string for the server
    const metaTagsString = createMetaTagsString(values);

    const submissionData: BlogFormSubmissionData = {
      title: values.title,
      slug: values.slug,
      shortDescription: values.shortDescription,
      fullDescription: values.fullDescription,
      coverImage: values.coverImage || undefined,
      metaTags: metaTagsString, // Send the stringified JSON to server
      imagesGallery: values.imagesGallery || undefined,
      videosGallery: values.videosGallery || undefined,
    };
    onSubmit(submissionData);
  };

  // Display skeleton while loading
  if (isLoading && mode === "edit") {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="mb-6">
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-8 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          {backUrl && (
            <Link href={backUrl}>
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {backButtonText ||
                  (mode === "edit" ? "Back to Blog" : "Back to Blogs")}
              </Button>
            </Link>
          )}
          {showViewButton && viewUrl && (
            <Link href={viewUrl}>
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                View Blog
              </Button>
            </Link>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {title ||
                (mode === "edit" ? "Edit Blog Post" : "Create Blog Post")}
            </h1>
            <p className="text-muted-foreground">
              {description ||
                (mode === "edit"
                  ? "Update the details of this blog post"
                  : "Create a new blog post for your website")}
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Main details about your blog post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter blog post title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <Input placeholder="blog-post-slug" {...field} />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-muted-foreground">
                        URL-friendly version of the title. Auto-generated from
                        title if empty.
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of the blog post"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
                <CardDescription>
                  Select the main cover image for this blog post
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isLoading && (
                  <SingleImageSelector
                    value={form.watch("coverImage")}
                    absoluteValue={
                      mode === "edit"
                        ? initialData?.coverImageAbsoluteUrl ||
                          form.watch("coverImage")
                        : form.watch("coverImage")
                    }
                    onChange={(url) => form.setValue("coverImage", url || "")}
                    disabled={isSubmitting}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>Full content of your blog post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="fullDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ""}
                        onChange={(html) => field.onChange(html)}
                        placeholder="Write your blog post content here..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Images Gallery</CardTitle>
                <CardDescription>
                  Additional images for the blog post
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isLoading && (
                  <MultipleImageSelector
                    value={form.watch("imagesGallery")}
                    absoluteValues={
                      mode === "edit"
                        ? initialData?.absoluteImagesGallery ||
                          form.watch("imagesGallery")
                        : undefined
                    }
                    onChange={(urls) => {
                      form.setValue("imagesGallery", urls, {
                        shouldDirty: true,
                      });
                    }}
                    disabled={isSubmitting}
                    maxImages={20}
                    emptyStateTitle="No blog images selected"
                    emptyStateDescription="Click to select blog images from your media library"
                    imageAltPrefix="Blog image"
                  />
                )}
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle>Videos Gallery</CardTitle>
                <CardDescription>
                  Video URLs for the blog post (one URL per line)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="videosGallery"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="https://youtube.com/watch?v=example&#10;https://vimeo.com/123456789"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card> */}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Search engine optimization settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Meta Tags */}
              <div className="grid gap-4 md:grid-cols-1">
                <h4 className="text-sm font-medium">Basic Meta Tags</h4>

                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input placeholder="SEO title (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-muted-foreground">
                        Leave empty to use the blog title. Recommended: 50-60
                        characters
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="SEO description for search results"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-muted-foreground">
                        Recommended: 150-160 characters
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metaKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Keywords</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="blog, tutorial, web development"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-muted-foreground">
                        Comma-separated keywords (less important for modern SEO)
                      </p>
                    </FormItem>
                  )}
                />
                {/* 
                <FormField
                  control={form.control}
                  name="robots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Robots Tag</FormLabel>
                      <FormControl>
                        <Input placeholder="index,follow" {...field} />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-muted-foreground">
                        Default: index,follow
                      </p>
                    </FormItem>
                  )}
                /> */}

                {/* <FormField
                  control={form.control}
                  name="canonical"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canonical URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/blog/slug"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-muted-foreground">
                        Full canonical URL (optional)
                      </p>
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input placeholder="Author name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Open Graph Tags */}
              {/* <div className="grid gap-4 md:grid-cols-1 border-t pt-4">
                <h4 className="text-sm font-medium">
                  Open Graph Tags (Social Media)
                </h4>

                <FormField
                  control={form.control}
                  name="ogTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OG Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Social media title (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-muted-foreground">
                        Leave empty to use meta title
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ogDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OG Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Social media description"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-muted-foreground">
                        Leave empty to use meta description
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ogImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OG Image</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-muted-foreground">
                        Leave empty to use cover image
                      </p>
                    </FormItem>
                  )}
                />
              </div> */}

              {/* Twitter Card Tags */}
              {/* <div className="grid gap-4 md:grid-cols-1 border-t pt-4">
                <h4 className="text-sm font-medium">Twitter Card Tags</h4>

                <FormField
                  control={form.control}
                  name="twitterCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter Card Type</FormLabel>
                      <FormControl>
                        <Input placeholder="summary_large_image" {...field} />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-muted-foreground">
                        summary, summary_large_image, app, player
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twitterTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Twitter title (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-muted-foreground">
                        Leave empty to use meta title
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twitterDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Twitter description"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-muted-foreground">
                        Leave empty to use meta description
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twitterImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter Image</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/twitter-image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-muted-foreground">
                        Leave empty to use OG image
                      </p>
                    </FormItem>
                  )}
                />
              </div> */}
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting
                ? submitButtonLoadingText ||
                  (mode === "edit" ? "Updating..." : "Creating...")
                : submitButtonText ||
                  (mode === "edit" ? "Update Blog" : "Create Blog")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
