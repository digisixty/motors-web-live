"use client";

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
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SingleImageSelector } from "@/components/single-image-selector";
import { CarListingDto } from "@workspace/api";

const sliderFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  shortDescription: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .nullable(),
  image: z.string().optional().nullable(),
  video: z.string().optional().nullable(),
  isEnabled: z.boolean(),
  bgColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$|^$/, "Must be a valid hex color code or empty")
    .optional()
    .nullable(),
  carId: z.number().optional().nullable(),
});

export type SliderFormData = z.infer<typeof sliderFormSchema>;

export interface SliderFormProps {
  mode: "create" | "edit";
  onSubmit: (values: SliderFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitButtonText: string;
  submitButtonLoadingText: string;
  title: string;
  description: string;
  backButtonText: string;
  backUrl: string;
  initialData?: Partial<SliderFormData> & { imageAbsoluteUrl?: string; videoAbsoluteUrl?: string };
  cars: CarListingDto[];
}

export default function SliderForm({
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
  cars,
}: SliderFormProps) {
  const form = useForm<SliderFormData>({
    resolver: zodResolver(sliderFormSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      image: "",
      video: "",
      isEnabled: true,
      bgColor: null,
      carId: null,
      ...initialData,
    },
  });

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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter slider title"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      The main heading or title displayed on the slider
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a short description for the slider"
                        {...field}
                        disabled={isSubmitting}
                        rows={3}
                        value={field?.value || undefined}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description that appears below the title
                      (optional)
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
                    <FormLabel>Background Image</FormLabel>
                    <FormControl>
                      <SingleImageSelector
                        value={field.value || undefined}
                        absoluteValue={initialData?.imageAbsoluteUrl}
                        onChange={(url) => field.onChange(url)}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Select a background image for the slider (recommended:
                      1920x600px)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="video"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background Video</FormLabel>
                    <FormControl>
                      <SingleImageSelector
                        value={field.value || undefined}
                        absoluteValue={initialData?.videoAbsoluteUrl}
                        onChange={(url) => field.onChange(url)}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Select a background video for the slider (video will be
                      displayed instead of image if selected)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bgColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background Color (Optional)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Input
                            type="color"
                            className="w-20 h-10 p-1"
                            value={field.value || "#ffffff"}
                            onChange={(e) => field.onChange(e.target.value)}
                            disabled={isSubmitting}
                          />
                          {!field.value && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span className="text-xs text-muted-foreground bg-white rounded px-1">
                                None
                              </span>
                            </div>
                          )}
                        </div>
                        <Input
                          placeholder="e.g. #FF0000 (optional)"
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value.trim();
                            if (value === "") {
                              field.onChange(null);
                            } else if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                              field.onChange(value);
                            }
                          }}
                          disabled={isSubmitting}
                          className="flex-1"
                        />
                        {field.value && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => field.onChange(null)}
                            disabled={isSubmitting}
                            className="text-xs"
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Background color to use if no image is selected (hex
                      format, optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="carId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Linked Car</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(
                          value === "none" ? null : parseInt(value)
                        )
                      }
                      value={field.value?.toString() || "none"}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a car to link (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No car selected</SelectItem>
                        {cars?.map((car) => (
                          <SelectItem key={car.id} value={car.id!.toString()}>
                            {car.stockNumber} - {car.manufacturerName}{" "}
                            {car.carModelName}
                            {car.price && ` - $${car.price.toLocaleString()}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select a car to link this slider to (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Slider</FormLabel>
                      <FormDescription>
                        When enabled, this slider will be displayed on the
                        homepage
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
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
