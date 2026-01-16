"use client";

import React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetManufacturers,
  useGetCarModelsByManufacturer,
} from "@workspace/api";
import { ManufacturerDto, CarModelDto } from "@workspace/api";
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
import { ArrowLeft, Save, Eye, Car, DollarSign } from "lucide-react";
import Link from "next/link";
import CarAttributesSelector, {
  CarAttributeValue,
} from "./car-attributes-selector";
import CarOptionsSelector, { CarOptionValue } from "./car-options-selector";
import { SingleImageSelector } from "@/components/single-image-selector";
import { MultipleImageSelector } from "@/components/multiple-image-selector";
import RichTextEditor from "@/components/rich-text-editor";

// Function to generate a slug from manufacturer and car model names
const generateSlugFromManufacturerAndModel = (
  manufacturerName?: string,
  carModelName?: string
): string => {
  if (!manufacturerName && !carModelName) return "";

  const parts: string[] = [];
  if (manufacturerName)
    parts.push(
      manufacturerName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    );
  if (carModelName)
    parts.push(
      carModelName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    );

  const baseSlug = parts.filter(Boolean).join("-"); // Filter out empty strings and join with hyphens
  const randomSuffix = Math.floor(Math.random() * 10000); // Random number between 0-9999

  return `${baseSlug}-${randomSuffix}`;
};

// Car attribute type for form schema
const carAttributeSchema = z.object({
  carAttributeId: z.number(),
  carAttributeName: z.string(),
  carAttributeSlug: z.string(),
  value: z.string(),
});

// Car option type for form schema
const carOptionSchema = z.object({
  carOptionId: z.number(),
  carOptionName: z.string(),
  carOptionSlug: z.string(),
  value: z.string(),
});

// Form schema with Zod
const carListingFormSchema = z.object({
  manufacturerId: z.number().optional(),
  carModelId: z.number().optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    )
    .optional(),
  stockNumber: z.string().optional(),
  vinNumber: z.string().optional(),
  registrationDate: z.string().optional(),
  primaryImage: z.string().optional(),
  interiorImages: z.string().optional(),
  exteriorImages: z.string().optional(),
  videos: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number").optional(),
  salePrice: z.coerce
    .number()
    .min(0, "Sale price must be a positive number")
    .optional(),
  isSold: z.boolean().default(false),
  customPriceLabel: z.string().optional(),
  cardFooterLabel: z.string().optional(),
  isSpecialOffer: z.boolean().default(false),
  description: z.string().optional(),
  interiorImagesGallery: z.array(z.string()).optional(),
  exteriorImagesGallery: z.array(z.string()).optional(),
  carAttributes: z.array(carAttributeSchema).optional(),
  carOptions: z.array(carOptionSchema).optional(),
  // SEO fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  author: z.string().optional(),
  // Legacy metaTags for server compatibility
  metaTags: z.string().optional(),
});

export type CarListingFormValues = z.infer<typeof carListingFormSchema>;

export interface CarListingFormSubmissionData {
  manufacturerId?: number;
  carModelId?: number;
  slug?: string;
  stockNumber?: string;
  vinNumber?: string;
  registrationDate?: string;
  primaryImage?: string;
  interiorImages?: string;
  exteriorImages?: string;
  videos?: string;
  price?: number;
  salePrice?: number;
  isSold: boolean;
  customPriceLabel?: string;
  cardFooterLabel?: string;
  isSpecialOffer: boolean;
  description?: string;
  carAttributes?: CarAttributeValue[];
  carOptions?: CarOptionValue[];
  interiorImagesGallery?: string[];
  exteriorImagesGallery?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  author?: string;
  metaTags?: string;
}

export interface CarListingFormProps {
  mode: "create" | "edit";
  initialData?: {
    manufacturerId?: number;
    carModelId?: number;
    slug?: string;
    stockNumber?: string;
    vinNumber?: string;
    registrationDate?: string;
    primaryImage?: string;
    primaryImageAbsoluteUrl?: string;
    interiorImages?: string;
    exteriorImages?: string;
    videos?: string;
    price?: number;
    salePrice?: number;
    isSold?: boolean;
    customPriceLabel?: string;
    cardFooterLabel?: string;
    isSpecialOffer?: boolean;
    description?: string;
    interiorImagesGallery?: string[];
    exteriorImagesGallery?: string[];
    absoluteInteriorImagesGallery?: string[];
    absoluteExteriorImagesGallery?: string[];
    absoluteVideos?: string[];
    carAttributes?: CarAttributeValue[];
    carOptions?: CarOptionValue[];
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    author?: string;
    metaTags?: string;
  };
  isLoading?: boolean;
  onSubmit: (values: CarListingFormSubmissionData) => void;
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

export default function CarListingForm({
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
}: CarListingFormProps) {
  const [isUserEditedSlug, setIsUserEditedSlug] = React.useState(false);

  // Extract SEO values from metaTagsObject if available
  const getSeoInitialValues = () => {
    const metaTagsObject = initialData?.metaTags;
    if (typeof metaTagsObject === 'string') {
      try {
        const parsed = JSON.parse(metaTagsObject);
        return {
          metaTitle: parsed.title || initialData?.metaTitle || "",
          metaDescription: parsed.description || initialData?.metaDescription || "",
          metaKeywords: parsed.keywords || initialData?.metaKeywords || "",
          author: parsed.author || initialData?.author || "",
          metaTags: metaTagsObject,
        };
      } catch {
        return {
          metaTitle: initialData?.metaTitle || "",
          metaDescription: initialData?.metaDescription || "",
          metaKeywords: initialData?.metaKeywords || "",
          author: initialData?.author || "",
          metaTags: metaTagsObject || "",
        };
      }
    }
    return {
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      metaKeywords: initialData?.metaKeywords || "",
      author: initialData?.author || "",
      metaTags: initialData?.metaTags || "",
    };
  };

  const seoInitialValues = getSeoInitialValues();

  const form = useForm<CarListingFormValues>({
    resolver: zodResolver(
      carListingFormSchema
    ) as Resolver<CarListingFormValues>,
    defaultValues: {
      manufacturerId: initialData?.manufacturerId || undefined,
      carModelId: initialData?.carModelId || undefined,
      slug: initialData?.slug || "",
      stockNumber: initialData?.stockNumber || "",
      vinNumber: initialData?.vinNumber || "",
      registrationDate: initialData?.registrationDate || "",
      primaryImage: initialData?.primaryImage || undefined,
      interiorImages: initialData?.interiorImages || "",
      exteriorImages: initialData?.exteriorImages || "",
      videos: initialData?.videos || "",
      price: initialData?.price || undefined,
      salePrice: initialData?.salePrice || undefined,
      isSold: initialData?.isSold || false,
      customPriceLabel: initialData?.customPriceLabel || "",
      cardFooterLabel: initialData?.cardFooterLabel || "",
      isSpecialOffer: initialData?.isSpecialOffer || false,
      description: initialData?.description || "",
      interiorImagesGallery: initialData?.interiorImagesGallery || [],
      exteriorImagesGallery: initialData?.exteriorImagesGallery || [],
      carAttributes: initialData?.carAttributes || [],
      carOptions: initialData?.carOptions || [],
      ...seoInitialValues,
    },
    mode: "onBlur",
  });

  // API calls for manufacturers and models
  const { data: manufacturers } = useGetManufacturers();

  const selectedManufacturerId = form.watch("manufacturerId");
  const selectedCarModelId = form.watch("carModelId");
  const currentSlug = form.watch("slug");

  // Only fetch car models when we have a valid manufacturerId
  const { data: carModels, isLoading: carModelsLoading } =
    useGetCarModelsByManufacturer(
      selectedManufacturerId || 0, // Fallback to 0 if undefined, but the API call will only happen when we have a real ID
      { query: { enabled: !!selectedManufacturerId } }
    );

  // Auto-generate slug when manufacturer and car model change
  React.useEffect(() => {
    if (mode === "create" && !isUserEditedSlug) {
      const manufacturer = manufacturers?.find(
        (m) => m.id === selectedManufacturerId
      );
      const carModel = carModels?.find((m) => m.id === selectedCarModelId);

      // Only auto-generate if we have manufacturer or car model
      if (manufacturer || carModel) {
        const newSlug = generateSlugFromManufacturerAndModel(
          manufacturer?.title,
          carModel?.name
        );
        form.setValue("slug", newSlug);
      }
    }
  }, [
    selectedManufacturerId,
    selectedCarModelId,
    mode,
    isUserEditedSlug,
    manufacturers,
    carModels,
    form,
  ]);

  // Reset user edit flag when manufacturer changes (since car model resets)
  const handleManufacturerChange = (value: string) => {
    const manufacturerId = value ? parseInt(value) : undefined;
    form.setValue("manufacturerId", manufacturerId);
    form.setValue("carModelId", undefined); // Reset car model when manufacturer changes
    setIsUserEditedSlug(false); // Allow auto-generation again
  };

  // Handler for when user manually edits the slug
  const handleSlugChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUserEditedSlug(true);
    form.setValue("slug", event.target.value);
  };

  // Handler for car model change (don't reset user edit flag for car model changes)
  const handleCarModelChange = (value: string) => {
    const carModelId = value ? parseInt(value) : undefined;
    form.setValue("carModelId", carModelId);
    // Don't reset user edit flag for car model changes - allow auto-generation to update slug
    // with the new car model if user hasn't manually edited
  };

  const onFormSubmit = (values: CarListingFormValues) => {
    // Build SEO metaTags object
    const seoMetaTags: { title?: string; description?: string; keywords?: string; author?: string } = {};
    if (values.metaTitle) seoMetaTags.title = values.metaTitle;
    if (values.metaDescription) seoMetaTags.description = values.metaDescription;
    if (values.metaKeywords) seoMetaTags.keywords = values.metaKeywords;
    if (values.author) seoMetaTags.author = values.author;

    const metaTags = Object.keys(seoMetaTags).length > 0 ? JSON.stringify(seoMetaTags) : undefined;

    const submissionData: CarListingFormSubmissionData = {
      ...values,
      // Ensure manufacturerId and carModelId are properly handled
      manufacturerId: values.manufacturerId || undefined,
      carModelId: values.carModelId || undefined,
      interiorImages: values.interiorImages || undefined,
      exteriorImages: values.exteriorImages || undefined,
      interiorImagesGallery: values.interiorImagesGallery || [],
      exteriorImagesGallery: values.exteriorImagesGallery || [],
      metaTags: metaTags || values.metaTags,
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
                  (mode === "edit"
                    ? "Back to Car Listing"
                    : "Back to Car Listings")}
              </Button>
            </Link>
          )}
          {showViewButton && viewUrl && (
            <Link href={viewUrl}>
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                View Car
              </Button>
            </Link>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {title ||
                (mode === "edit" ? "Edit Car Listing" : "Add Car to Inventory")}
            </h1>
            <p className="text-muted-foreground">
              {description ||
                (mode === "edit"
                  ? "Update the details of this car listing"
                  : "Add a new car to your inventory")}
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Main details about the vehicle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="manufacturerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manufacturer</FormLabel>
                      <Select
                        onValueChange={handleManufacturerChange}
                        value={field.value ? field.value.toString() : ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a manufacturer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {manufacturers?.map(
                            (manufacturer: ManufacturerDto) => (
                              <SelectItem
                                key={manufacturer.id}
                                value={manufacturer.id?.toString() || ""}
                              >
                                {manufacturer.title}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="carModelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Car Model</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value ? parseInt(value) : undefined);
                          handleCarModelChange(value);
                        }}
                        value={field.value ? field.value.toString() : ""}
                        disabled={!selectedManufacturerId || carModelsLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                selectedManufacturerId
                                  ? "Select a model"
                                  : "Select a manufacturer first"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {carModels?.map((model: CarModelDto) => (
                            <SelectItem
                              key={model.id}
                              value={model.id?.toString() || ""}
                            >
                              {model.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                          placeholder="Auto-generated from manufacturer and model"
                          value={field.value || ""}
                          onChange={handleSlugChange}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <p className="text-sm text-muted-foreground">
                        URL-friendly identifier. Use only lowercase letters,
                        numbers, and hyphens. Auto-generated from manufacturer
                        and model with random number.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {mode === "edit" && (
                  <FormField
                    control={form.control}
                    name="stockNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Number</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly className="bg-muted" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="vinNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VIN Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter VIN number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registrationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing Information
                </CardTitle>
                <CardDescription>Price and sale details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sale Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customPriceLabel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Price Label</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 'Special Price', 'Call for Price'"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cardFooterLabel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Footer Label</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 'New Arrival', 'Hot Deal'"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="isSold"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Mark as Sold</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Mark this vehicle as sold
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isSpecialOffer"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Special Offer</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Mark this as a special offer
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
              <CardDescription>
                Detailed description of the vehicle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ""}
                        onChange={(html) => field.onChange(html)}
                        placeholder="Enter a detailed description of the vehicle..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-6">
              {/* Primary Image Selector */}
              <div>
                <FormLabel className="text-base font-medium">
                  Primary Image
                </FormLabel>
                <p className="text-sm text-muted-foreground mb-4">
                  Select the main image that will appear as the thumbnail for
                  this listing
                </p>
                <SingleImageSelector
                  value={form.watch("primaryImage")}
                  absoluteValue={
                    mode === "edit"
                      ? initialData?.primaryImageAbsoluteUrl
                      : form.watch("primaryImage")
                  }
                  onChange={(url) => form.setValue("primaryImage", url || "")}
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Interior Images</CardTitle>
                <CardDescription>
                  Images of the car's interior (dashboard, seats, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MultipleImageSelector
                  value={form.watch("interiorImagesGallery") || []}
                  absoluteValues={
                    mode === "edit"
                      ? initialData?.absoluteInteriorImagesGallery
                      : undefined
                  }
                  onChange={(urls) => {
                    form.setValue("interiorImagesGallery", urls);
                  }}
                  disabled={isSubmitting}
                  maxImages={10}
                  emptyStateTitle="No interior images selected"
                  emptyStateDescription="Click to select interior images from your media library"
                  imageAltPrefix="Interior image"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exterior Images</CardTitle>
                <CardDescription>
                  Images of the car's exterior (front, back, sides, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MultipleImageSelector
                  value={form.watch("exteriorImagesGallery") || []}
                  absoluteValues={
                    mode === "edit"
                      ? initialData?.absoluteExteriorImagesGallery
                      : undefined
                  }
                  onChange={(urls) => {
                    form.setValue("exteriorImagesGallery", urls);
                  }}
                  disabled={isSubmitting}
                  maxImages={10}
                  emptyStateTitle="No exterior images selected"
                  emptyStateDescription="Click to select exterior images from your media library"
                  imageAltPrefix="Exterior image"
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Video</CardTitle>
              <CardDescription>
                Select a video for the car listing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SingleImageSelector
                value={form.watch("videos")}
                absoluteValue={
                  mode === "edit"
                    ? initialData?.absoluteVideos?.[0]
                    : form.watch("videos")
                }
                onChange={(url) => form.setValue("videos", url || "")}
                disabled={isSubmitting}
              />
            </CardContent>
          </Card>

          <CarAttributesSelector
            form={form}
            fieldName="carAttributes"
            initialData={initialData?.carAttributes}
            disabled={isSubmitting}
          />

          <CarOptionsSelector
            form={form}
            fieldName="carOptions"
            initialData={initialData?.carOptions}
            disabled={isSubmitting}
          />

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
                        Leave empty to use the car listing title. Recommended: 50-60
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
                          placeholder="bmw, sedan, used car"
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
                  (mode === "edit" ? "Updating..." : "Adding...")
                : submitButtonText ||
                  (mode === "edit" ? "Update Car" : "Add Car")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
