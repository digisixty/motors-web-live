"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CarAttributeDto, CarAttributeType } from "@workspace/api";
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
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, X } from "lucide-react";
import { SingleImageSelector } from "@/components/single-image-selector";

const carAttributeFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  type: z.nativeEnum(CarAttributeType),
  image: z.string().optional(),
  icon: z.string().optional(),
});

type CarAttributeFormData = z.infer<typeof carAttributeFormSchema>;

export interface CarAttributeFormSubmissionData {
  name: string;
  slug: string;
  description?: string;
  type: CarAttributeType;
  image?: string;
  icon?: string;
}

interface CarAttributeFormProps {
  mode: "create" | "edit";
  initialData?: CarAttributeDto;
  onSubmit: (values: CarAttributeFormSubmissionData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitButtonText: string;
  submitButtonLoadingText: string;
  title: string;
  description: string;
  backButtonText: string;
  backUrl: string;
  parentName?: string;
  hasParent?: boolean;
}

export default function CarAttributeForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  submitButtonText,
  submitButtonLoadingText,
  title,
  description,
  backButtonText,
  backUrl,
  parentName,
  hasParent = false,
}: CarAttributeFormProps) {
  const form = useForm<CarAttributeFormData>({
    resolver: zodResolver(carAttributeFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      type: hasParent
        ? CarAttributeType.String
        : initialData?.type || CarAttributeType.String,
      image: initialData?.image || "",
      icon: initialData?.icon || "",
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

  // Auto-generate slug when title changes and slug hasn't been manually touched
  useEffect(() => {
    if (watchedName && !form.formState.touchedFields.slug) {
      const generatedSlug = generateSlug(watchedName);
      form.setValue("slug", generatedSlug);
    }
  }, [watchedName, form]);

  const handleSubmit = (values: CarAttributeFormData) => {
    onSubmit({
      name: values.name.trim(),
      slug: values.slug.trim(),
      description: values.description?.trim() || undefined,
      type: hasParent ? CarAttributeType.String : values.type,
      image: values.image?.trim() || undefined,
      icon: values.icon?.trim() || undefined,
    });
  };

  const getAttributeTypeLabel = (type: CarAttributeType) => {
    switch (type) {
      case CarAttributeType.String:
        return "Text";
      case CarAttributeType.Number:
        return "Number";
      case CarAttributeType.Boolean:
        return "Boolean";
      case CarAttributeType.Color:
        return "Color";
      case CarAttributeType.List:
        return "List";
      case CarAttributeType.Title:
        return "Title";
      default:
        return "Unknown";
    }
  };

  const getAttributeTypeDescription = (type: CarAttributeType) => {
    switch (type) {
      case CarAttributeType.String:
        return "Text value (e.g., 'Automatic', 'Manual')";
      case CarAttributeType.Number:
        return "Numeric value (e.g., '4', '250')";
      case CarAttributeType.Boolean:
        return "Yes/No value (e.g., 'Available', 'Not Available')";
      case CarAttributeType.Color:
        return "Color value with color picker";
      case CarAttributeType.List:
        return "Multiple selection options";
      case CarAttributeType.Title:
        return "Section title";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
        {parentName && (
          <div className="mt-2">
            <span className="text-sm text-muted-foreground">Parent: </span>
            <Badge variant="outline">{parentName}</Badge>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attribute Information</CardTitle>
          <CardDescription>
            Configure the car attribute details and properties.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter attribute name" {...field} />
                    </FormControl>
                    <FormDescription>
                      The display name of the car attribute.
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
                      <Input placeholder="Enter attribute slug" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL-friendly identifier for the attribute.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {mode === "create" && !hasParent && (
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="h-14!">
                            <SelectValue placeholder="Select attribute type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(CarAttributeType).map(
                            ([key, value]) => (
                              <SelectItem key={key} value={value.toString()}>
                                <div className="flex flex-col items-start">
                                  <span>{getAttributeTypeLabel(value)}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {getAttributeTypeDescription(value)}
                                  </span>
                                </div>
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The data type for this attribute.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {mode === "create" && hasParent && (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {getAttributeTypeLabel(CarAttributeType.String)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {getAttributeTypeDescription(CarAttributeType.String)}
                    </span>
                  </div>
                </FormItem>
              )}
              {mode === "edit" && (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {getAttributeTypeLabel(
                        initialData?.type || CarAttributeType.String
                      )}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {getAttributeTypeDescription(
                        initialData?.type || CarAttributeType.String
                      )}
                    </span>
                  </div>
                </FormItem>
              )}

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter attribute description"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional description of what this attribute represents.
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
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <SingleImageSelector
                        value={field.value}
                        onChange={(url) => field.onChange(url)}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional image for the attribute.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <SingleImageSelector
                        value={field.value}
                        onChange={(url) => field.onChange(url)}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional icon for the attribute.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  <X className="mr-2 h-4 w-4" />
                  {backButtonText}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {submitButtonLoadingText}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {submitButtonText}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
