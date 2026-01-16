"use client";

import { useRouter, useParams } from "next/navigation";
import { useGetCarAttributes, useDeleteCarAttribute } from "@workspace/api";
import { toast } from "sonner";
import {
  getGetCarAttributesQueryKey,
  useQueryClient,
  CarAttributeDto,
} from "@workspace/api";
import { CarAttributeType } from "@workspace/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Edit,
  Trash,
  Plus,
  Settings,
  Image as ImageIcon,
  Link as LinkIcon,
  FileText,
} from "lucide-react";
import Link from "next/link";

// Utility function to find attribute by ID in nested structure
const findAttributeById = (
  attributes: CarAttributeDto[],
  id: number
): CarAttributeDto | null => {
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
const findParentName = (
  attributes: CarAttributeDto[],
  childId: number
): string | null => {
  for (const attr of attributes) {
    if (attr.children?.some((child) => child.id === childId)) {
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
    default:
      return "";
  }
};

export default function ViewCarAttributePage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = parseInt(params.id as string);

  const { data: carAttributesData, isLoading } = useGetCarAttributes();

  const deleteCarAttributeMutation = useDeleteCarAttribute({
    mutation: {
      onSuccess: () => {
        toast.success("Car attribute deleted successfully");
        queryClient.invalidateQueries({
          queryKey: getGetCarAttributesQueryKey(),
        });
        router.push("/car-attributes");
      },
      onError: (error) => {
        toast.error("Failed to delete car attribute: " + error.message);
      },
    },
  });

  const attribute = carAttributesData
    ? findAttributeById(carAttributesData, id)
    : null;
  const parentName =
    carAttributesData && attribute?.parentId
      ? findParentName(carAttributesData, id)
      : null;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this car attribute?")) {
      deleteCarAttributeMutation.mutate({ id });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="mb-6">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!attribute) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Attribute not found
              </h3>
              <p className="text-muted-foreground mb-4">
                The car attribute you're looking for doesn't exist.
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/car-attributes">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Attributes
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              {attribute.name}
            </h1>
          </div>
          {/* <div className="flex items-center gap-2">
            <Link href={`/car-attributes/${attribute.id}/edit`}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteCarAttributeMutation.isPending}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div> */}
        </div>
        <p className="text-muted-foreground">
          View and manage car attribute details
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Attribute Information
              </CardTitle>
              <CardDescription>
                Basic information about this car attribute
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    ID
                  </dt>
                  <dd className="font-mono text-sm">{attribute.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Name
                  </dt>
                  <dd className="font-medium">{attribute.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Slug
                  </dt>
                  <dd className="font-mono text-sm">{attribute.slug}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Type
                  </dt>
                  <dd>
                    <Badge variant="outline">
                      {getAttributeTypeLabel(attribute.type!)}
                    </Badge>
                  </dd>
                </div>
                {attribute.parentId && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Parent
                    </dt>
                    <dd className="text-sm">
                      {parentName || `ID: ${attribute.parentId}`}
                    </dd>
                  </div>
                )}
                {attribute.description && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Description
                    </dt>
                    <dd className="mt-1">{attribute.description}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>
                Images and icons associated with this attribute
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {attribute.image && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Image
                    </dt>
                    <dd>
                      <div className="aspect-video rounded-lg overflow-hidden border">
                        <img
                          src={attribute.image}
                          alt={attribute.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement!.innerHTML = `
                              <div class="flex items-center justify-center h-full text-muted-foreground">
                                <span>Failed to load image</span>
                              </div>
                            `;
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 truncate">
                        {attribute.image}
                      </p>
                    </dd>
                  </div>
                )}
                {attribute.icon && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Icon
                    </dt>
                    <dd>
                      <div className="w-20 h-20 rounded-lg overflow-hidden border bg-white p-2">
                        <img
                          src={attribute.icon}
                          alt={`${attribute.name} icon`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement!.innerHTML = `
                              <div class="flex items-center justify-center h-full text-muted-foreground">
                                <span class="text-xs">Failed</span>
                              </div>
                            `;
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 truncate">
                        {attribute.icon}
                      </p>
                    </dd>
                  </div>
                )}
                {!attribute.image && !attribute.icon && (
                  <div className="sm:col-span-2 text-center text-muted-foreground py-8">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No images or icons added</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {attribute.children && attribute.children.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Child Attributes</span>
                  {attribute.type === CarAttributeType.List && (
                    <Link
                      href={`/car-attributes/create?parentId=${attribute.id}`}
                    >
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Child
                      </Button>
                    </Link>
                  )}
                </CardTitle>
                <CardDescription>
                  Attributes that are children of this attribute
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {attribute.children.map((child) => (
                    <div
                      key={child.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{child.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {child.slug}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {getAttributeTypeLabel(child.type!)}
                          </Badge>
                          {child.description && (
                            <span className="text-xs text-muted-foreground">
                              {child.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/car-attributes/${child.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                        <Link href={`/car-attributes/${child.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 flex flex-col">
              <Link href={`/car-attributes/${attribute.id}/edit`}>
                <Button className="w-full" variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Attribute
                </Button>
              </Link>
              {attribute.type === CarAttributeType.List && (
                <Link href={`/car-attributes/create?parentId=${attribute.id}`}>
                  <Button className="w-full" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Child Attribute
                  </Button>
                </Link>
              )}
              <Button
                className="w-full"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteCarAttributeMutation.isPending}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Attribute
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attribute Type</CardTitle>
              <CardDescription>
                Information about this attribute's data type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline" className="text-sm">
                  {getAttributeTypeLabel(attribute.type!)}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {getAttributeTypeDescription(attribute.type!)}
                </p>
              </div>
            </CardContent>
          </Card>

          {attribute.parentId && (
            <Card>
              <CardHeader>
                <CardTitle>Parent Attribute</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">
                    {parentName || `ID: ${attribute.parentId}`}
                  </p>
                  <Link href={`/car-attributes/${attribute.parentId}`}>
                    <Button variant="outline" size="sm">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      View Parent
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
