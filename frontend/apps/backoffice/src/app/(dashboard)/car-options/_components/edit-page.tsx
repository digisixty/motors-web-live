"use client";

import { useRouter, useParams } from "next/navigation";
import { useUpdateCarOption, useGetCarOptions } from "@workspace/api";
import { toast } from "sonner";
import {
  UpdateCarOptionCommand,
  getGetCarOptionsQueryKey,
  useQueryClient,
  CarOptionDto,
} from "@workspace/api";
import CarOptionForm, { CarOptionFormSubmissionData } from "./car-option-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { CarOptionType } from "@workspace/api";

// Utility function to find option by ID in nested structure
const findOptionById = (
  options: CarOptionDto[],
  id: number
): CarOptionDto | null => {
  for (const opt of options) {
    if (opt.id === id) return opt;
    if (opt.children) {
      const found = findOptionById(opt.children, id);
      if (found) return found;
    }
  }
  return null;
};

// Utility function to find parent name
const findParentName = (
  options: CarOptionDto[],
  childId: number
): string | null => {
  for (const opt of options) {
    if (opt.children?.some((child) => child.id === childId)) {
      return opt.name || null;
    }
    if (opt.children) {
      const found = findParentName(opt.children, childId);
      if (found) return found;
    }
  }
  return null;
};

const getOptionTypeLabel = (type: CarOptionType) => {
  switch (type) {
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

export default function EditCarOptionPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = parseInt(params.id as string);

  const { data: carOptionsData, isLoading } = useGetCarOptions({});

  const updateCarOptionMutation = useUpdateCarOption({
    mutation: {
      onSuccess: () => {
        toast.success("Car option updated successfully!");
        router.push(`/car-options/${id}`);
        queryClient.invalidateQueries({ queryKey: getGetCarOptionsQueryKey() });
      },
      onError: (error) => {
        toast.error("Failed to update car option: " + error.message);
      },
    },
  });

  const option = carOptionsData ? findOptionById(carOptionsData, id) : null;
  const parentName =
    carOptionsData && option?.parentId
      ? findParentName(carOptionsData, id)
      : null;

  const onSubmit = (values: CarOptionFormSubmissionData) => {
    if (!option) return;

    const submissionData: UpdateCarOptionCommand = {
      id: option.id,
      name: values.name.trim(),
      slug: values.slug.trim(),
      description: values.description?.trim() || null,
      type: values.type,
      image: values.image?.trim() || null,
      icon: values.icon?.trim() || null,
      parentId: option.parentId, // Keep the same parent
    };

    updateCarOptionMutation.mutate({ id, data: submissionData });
  };

  const onCancel = () => {
    router.push(`/car-options/${id}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="mb-6">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!option) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Option not found</h3>
              <p className="text-muted-foreground mb-4">
                The car option you're trying to edit doesn't exist.
              </p>
              <Link href="/car-options">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Options
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href={`/car-options/${id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Option
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Edit className="h-8 w-8" />
          Edit Car Option
        </h1>
        <p className="text-muted-foreground">
          Update the car option information and properties.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <CarOptionForm
            mode="edit"
            initialData={option}
            onSubmit={onSubmit}
            onCancel={onCancel}
            isSubmitting={updateCarOptionMutation.isPending}
            submitButtonText="Update Option"
            submitButtonLoadingText="Updating..."
            title="Edit Option Information"
            description="Update the details for this car option."
            backButtonText="Cancel"
            backUrl={`/car-options/${id}`}
            parentName={parentName || undefined}
            hasParent={!!option.parentId}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Information</CardTitle>
              <CardDescription>Current values for this option</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  ID
                </label>
                <p className="font-mono">{option.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Name
                </label>
                <p className="font-medium">{option.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Slug
                </label>
                <p className="font-mono text-sm">{option.slug}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Type
                </label>
                <div>
                  <Badge variant="outline">
                    {getOptionTypeLabel(option.type!)}
                  </Badge>
                </div>
              </div>
              {option.parentId && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Parent
                  </label>
                  <p className="text-sm">
                    {parentName || `ID: ${option.parentId}`}
                  </p>
                </div>
              )}
              {option.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Description
                  </label>
                  <p className="text-sm">{option.description}</p>
                </div>
              )}
              {option.image && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Image
                  </label>
                  <p className="text-sm truncate">{option.image}</p>
                </div>
              )}
              {option.icon && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Icon
                  </label>
                  <p className="text-sm truncate">{option.icon}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
