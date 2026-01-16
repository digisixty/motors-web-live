"use client";

import { useRouter, useParams } from "next/navigation";
import { useUpdateCarAttribute, useGetCarAttributes } from "@workspace/api";
import { toast } from "sonner";
import {
  UpdateCarAttributeCommand,
  getGetCarAttributesQueryKey,
  useQueryClient,
  CarAttributeDto,
} from "@workspace/api";
import CarAttributeForm, { CarAttributeFormSubmissionData } from "./car-attribute-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { CarAttributeType } from "@workspace/api";

// Utility function to find attribute by ID in nested structure
const findAttributeById = (attributes: CarAttributeDto[], id: number): CarAttributeDto | null => {
  for (const attr of attributes) {
    if (attr.id === id) return attr;
    if (attr.children) {
      const found = findAttributeById(attr.children, id);
      if (found) return found;
    }
  }
  return null;
};

// Utility function to find parent name
const findParentName = (attributes: CarAttributeDto[], childId: number): string | null => {
  for (const attr of attributes) {
    if (attr.children?.some(child => child.id === childId)) {
      return attr.name || null;
    }
    if (attr.children) {
      const found = findParentName(attr.children, childId);
      if (found) return found;
    }
  }
  return null;
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
    default:
      return "Unknown";
  }
};

export default function EditCarAttributePage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = parseInt(params.id as string);

  const { data: carAttributesData, isLoading } = useGetCarAttributes();

  const updateCarAttributeMutation = useUpdateCarAttribute({
    mutation: {
      onSuccess: () => {
        toast.success("Car attribute updated successfully!");
        router.push(`/car-attributes/${id}`);
        queryClient.invalidateQueries({ queryKey: getGetCarAttributesQueryKey() });
      },
      onError: (error) => {
        toast.error("Failed to update car attribute: " + error.message);
      },
    },
  });

  const attribute = carAttributesData ? findAttributeById(carAttributesData, id) : null;
  const parentName = carAttributesData && attribute?.parentId ? findParentName(carAttributesData, id) : null;

  const onSubmit = (values: CarAttributeFormSubmissionData) => {
    if (!attribute) return;

    const submissionData: UpdateCarAttributeCommand = {
      id: attribute.id,
      name: values.name.trim(),
      slug: values.slug.trim(),
      description: values.description?.trim() || null,
      type: values.type,
      image: values.image?.trim() || null,
      icon: values.icon?.trim() || null,
      parentId: attribute.parentId, // Keep the same parent
    };

    updateCarAttributeMutation.mutate({ id, data: submissionData });
  };

  const onCancel = () => {
    router.push(`/car-attributes/${id}`);
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

  if (!attribute) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Attribute not found</h3>
              <p className="text-muted-foreground mb-4">
                The car attribute you're trying to edit doesn't exist.
              </p>
              <Link href="/car-attributes">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Attributes
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
          <Link href={`/car-attributes/${id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Attribute
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Edit className="h-8 w-8" />
          Edit Car Attribute
        </h1>
        <p className="text-muted-foreground">
          Update the car attribute information and properties.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <CarAttributeForm
            mode="edit"
            initialData={attribute}
            onSubmit={onSubmit}
            onCancel={onCancel}
            isSubmitting={updateCarAttributeMutation.isPending}
            submitButtonText="Update Attribute"
            submitButtonLoadingText="Updating..."
            title="Edit Attribute Information"
            description="Update the details for this car attribute."
            backButtonText="Cancel"
            backUrl={`/car-attributes/${id}`}
            parentName={parentName || undefined}
            hasParent={!!attribute.parentId}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Information</CardTitle>
              <CardDescription>
                Current values for this attribute
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">ID</label>
                <p className="font-mono">{attribute.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="font-medium">{attribute.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Slug</label>
                <p className="font-mono text-sm">{attribute.slug}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <div>
                  <Badge variant="outline">
                    {getAttributeTypeLabel(attribute.type!)}
                  </Badge>
                </div>
              </div>
              {attribute.parentId && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Parent</label>
                  <p className="text-sm">{parentName || `ID: ${attribute.parentId}`}</p>
                </div>
              )}
              {attribute.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm">{attribute.description}</p>
                </div>
              )}
              {attribute.image && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Image</label>
                  <p className="text-sm truncate">{attribute.image}</p>
                </div>
              )}
              {attribute.icon && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Icon</label>
                  <p className="text-sm truncate">{attribute.icon}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}