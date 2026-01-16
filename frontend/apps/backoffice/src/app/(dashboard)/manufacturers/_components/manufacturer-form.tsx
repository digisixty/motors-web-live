"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SingleImageSelector } from "@/components/single-image-selector";

const manufacturerFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  slug: z.string().min(1, "Slug is required").max(100, "Slug must be less than 100 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  logo: z.string().optional(),
});

export type ManufacturerFormData = z.infer<typeof manufacturerFormSchema>;

export interface ManufacturerFormProps {
  mode: "create" | "edit";
  onSubmit: (values: ManufacturerFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitButtonText: string;
  submitButtonLoadingText: string;
  title: string;
  description: string;
  backButtonText: string;
  backUrl: string;
  initialData?: Partial<ManufacturerFormData> & { logoAbsoluteUrl?: string };
}

export default function ManufacturerForm({
  mode,
  onSubmit,
  onCancel,
  isSubmitting,
  submitButtonText,
  submitButtonLoadingText,
  title,
  description,
  backButtonText,
  backUrl,
  initialData,
}: ManufacturerFormProps) {
  const form = useForm<ManufacturerFormData>({
    resolver: zodResolver(manufacturerFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      logo: "",
      ...initialData,
    },
  });

  const watchedTitle = form.watch("title");

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
    if (watchedTitle && !form.formState.touchedFields.slug) {
      const generatedSlug = generateSlug(watchedTitle);
      form.setValue("slug", generatedSlug);
    }
  }, [watchedTitle, form]);

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-6">
        <Link href={backUrl} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {backButtonText}
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter manufacturer title"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      The name of the car manufacturer (e.g., "Toyota", "Ford", "BMW")
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="manufacturer-slug"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      URL-friendly identifier for the manufacturer
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter manufacturer description"
                        className="resize-none"
                        rows={3}
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description of the manufacturer (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <SingleImageSelector
                        value={field.value}
                        absoluteValue={initialData?.logoAbsoluteUrl}
                        onChange={(url) => field.onChange(url)}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Select a logo for the manufacturer from your media library (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? submitButtonLoadingText : submitButtonText}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}