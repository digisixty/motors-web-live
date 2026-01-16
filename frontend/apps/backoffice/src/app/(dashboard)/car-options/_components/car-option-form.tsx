"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CarOptionDto, CarOptionType } from "@workspace/api";
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

const carOptionFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  type: z.nativeEnum(CarOptionType),
  image: z.string().optional(),
  icon: z.string().optional(),
});

type CarOptionFormData = z.infer<typeof carOptionFormSchema>;

export interface CarOptionFormSubmissionData {
  name: string;
  slug: string;
  description?: string;
  type: CarOptionType;
  image?: string;
  icon?: string;
}

interface CarOptionFormProps {
  mode: "create" | "edit";
  initialData?: CarOptionDto;
  onSubmit: (values: CarOptionFormSubmissionData) => void;
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

export default function CarOptionForm({
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
}: CarOptionFormProps) {
  const form = useForm<CarOptionFormData>({
    resolver: zodResolver(carOptionFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      type: initialData?.type || CarOptionType.String,
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

  // Auto-generate slug when name changes and slug hasn't been manually touched
  useEffect(() => {
    if (watchedName && !form.formState.touchedFields.slug) {
      const generatedSlug = generateSlug(watchedName);
      form.setValue("slug", generatedSlug);
    }
  }, [watchedName, form]);

  const getOptionTypeLabel = (type: CarOptionType) => {
    switch (type) {
      case CarOptionType.Title:
        return "Title";
      case CarOptionType.String:
        return "Text";
      case CarOptionType.Number:
        return "Number";
      case CarOptionType.Boolean:
        return "Checkbox";
      case CarOptionType.Color:
        return "Color";
      case CarOptionType.List:
        return "List";
      default:
        return "Unknown";
    }
  };

  const getOptionTypeDescription = (type: CarOptionType) => {
    switch (type) {
      case CarOptionType.Title:
        return "The section title";
      case CarOptionType.String:
        return "For text values like names, descriptions, etc.";
      case CarOptionType.Number:
        return "For numeric values like year, mileage, price, etc.";
      case CarOptionType.Boolean:
        return "For yes/no or true/false values";
      case CarOptionType.Color:
        return "For color values with color picker";
      case CarOptionType.List:
        return "For predefined list of options (requires child options)";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Button variant="outline" asChild>
          <a href={backUrl}>
            <X className="mr-2 h-4 w-4" />
            {backButtonText}
          </a>
        </Button>
      </div>

      {/* Parent Information */}
      {hasParent && parentName && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Parent Option:</span>
              <Badge variant="secondary">{parentName}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Option Details</CardTitle>
          <CardDescription>
            Configure the basic properties of this car option
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter option name"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        The display name for this option
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Slug */}
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="option-slug"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        URL-friendly identifier (auto-generated from name)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {mode === "create" && (
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger className="h-14!">
                            <SelectValue placeholder="Select option type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(CarOptionType).map(([, value]) => (
                            <SelectItem key={value} value={value.toString()}>
                              <div>
                                <div className="font-medium text-left">
                                  {getOptionTypeLabel(value)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {getOptionTypeDescription(value)}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The type of values this option will accept
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {mode === "edit" && (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {getOptionTypeLabel(
                        initialData?.type || CarOptionType.String
                      )}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {getOptionTypeDescription(
                        initialData?.type || CarOptionType.String
                      )}
                    </span>
                  </div>
                  <FormDescription>
                    The type of values this option will accept
                    {hasParent && (
                      <span className="text-red-600 block">
                        Type is inherited from parent option
                      </span>
                    )}
                  </FormDescription>
                </FormItem>
              )}

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter option description (optional)"
                        {...field}
                        disabled={isSubmitting}
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional description to help users understand this option
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Media URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Icon URL */}
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/icon.png"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional icon URL for this option
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image URL */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.png"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional image URL for this option
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  asChild
                >
                  <a href={backUrl}>{backButtonText}</a>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? submitButtonLoadingText : submitButtonText}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
