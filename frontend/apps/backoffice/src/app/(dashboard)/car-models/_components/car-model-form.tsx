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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SingleImageSelector } from "@/components/single-image-selector";
import { ManufacturerDto } from "@workspace/api";

const carModelFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be less than 100 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must only contain lowercase letters, numbers, and hyphens"
    ),
  manufacturerId: z.number().min(1, "Manufacturer is required"),
  image: z.string().optional(),
});

export type CarModelFormData = z.infer<typeof carModelFormSchema>;

export interface CarModelFormProps {
  mode: "create" | "edit";
  onSubmit: (values: CarModelFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitButtonText: string;
  submitButtonLoadingText: string;
  title: string;
  description: string;
  backButtonText: string;
  backUrl: string;
  initialData?: Partial<CarModelFormData> & { imageAbsoluteUrl?: string };
  manufacturers: ManufacturerDto[];
}

export default function CarModelForm({
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
  manufacturers,
}: CarModelFormProps) {
  const form = useForm<CarModelFormData>({
    resolver: zodResolver(carModelFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      manufacturerId: 0,
      image: "",
      ...initialData,
    },
  });

  const watchedName = form.watch("name");

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Auto-generate slug when name changes and slug hasn't been manually touched
  useEffect(() => {
    if (watchedName && !form.formState.touchedFields.slug) {
      const generatedSlug = generateSlug(watchedName);
      form.setValue("slug", generatedSlug);
    }
  }, [watchedName, form]);

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-6">
        <Link
          href={backUrl}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter car model name"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      The name of the car model (e.g., "Model 3", "Mustang",
                      "Civic")
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
                        placeholder="car-model-slug"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      URL-friendly identifier for the car model
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manufacturerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value ? field.value.toString() : ""}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a manufacturer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {manufacturers.map((manufacturer) => (
                          <SelectItem
                            key={manufacturer.id}
                            value={manufacturer.id!.toString()}
                          >
                            {manufacturer.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the manufacturer for this car model
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model Image</FormLabel>
                    <FormControl>
                      <SingleImageSelector
                        value={field.value}
                        absoluteValue={initialData?.imageAbsoluteUrl}
                        onChange={(url) => field.onChange(url)}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Select an image for the car model from your media library
                      (optional)
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
