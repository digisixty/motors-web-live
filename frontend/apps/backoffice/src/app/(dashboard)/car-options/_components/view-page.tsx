"use client";

import { useRouter, useParams } from "next/navigation";
import { useGetCarOptions, useDeleteCarOption } from "@workspace/api";
import { toast } from "sonner";
import {
  getGetCarOptionsQueryKey,
  useQueryClient,
  CarOptionDto,
} from "@workspace/api";
import { CarOptionType } from "@workspace/api";
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
  CheckSquare,
  Image as ImageIcon,
  Link as LinkIcon,
  FileText,
} from "lucide-react";
import Link from "next/link";

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

const getOptionTypeDescription = (type: CarOptionType) => {
  switch (type) {
    case CarOptionType.String:
      return "Text value (e.g., 'Automatic', 'Manual')";
    case CarOptionType.Number:
      return "Numeric value (e.g., '4', '250')";
    case CarOptionType.Boolean:
      return "Yes/No value (e.g., 'Available', 'Not Available')";
    case CarOptionType.Color:
      return "Color value with color picker";
    case CarOptionType.List:
      return "Multiple selection options";
    default:
      return "";
  }
};

export default function ViewCarOptionPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const { data: carOptionsData, isLoading, error } = useGetCarOptions({});

  const deleteCarOptionMutation = useDeleteCarOption({
    mutation: {
      onSuccess: () => {
        toast.success("Car option deleted successfully");
        router.push("/car-options");
        queryClient.invalidateQueries({
          queryKey: getGetCarOptionsQueryKey(),
        });
      },
      onError: (error) => {
        toast.error("Failed to delete car option: " + error.message);
      },
    },
  });

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this car option?")) {
      deleteCarOptionMutation.mutate({ id: parseInt(id) });
    }
  };

  const handleEdit = () => {
    router.push(`/car-options/${id}/edit`);
  };

  const handleCreateChild = () => {
    router.push(`/car-options/create?parentId=${id}`);
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading car option: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !carOptionsData) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const carOption = findOptionById(carOptionsData, parseInt(id));

  if (!carOption) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">Car option not found</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const parentName = findParentName(carOptionsData, parseInt(id));

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/car-options">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Options
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {carOption.name}
            </h1>
            <p className="text-muted-foreground">{carOption.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/car-options/create?parentId=${carOption.id}`}>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Child
            </Button>
          </Link>
          <Button onClick={handleEdit} size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteCarOptionMutation.isPending}
            size="sm"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Name
                  </p>
                  <p className="font-medium">{carOption.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Slug
                  </p>
                  <Badge variant="secondary">{carOption.slug}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Type
                  </p>
                  <div className="space-y-1">
                    <Badge variant="outline">
                      {getOptionTypeLabel(carOption.type!)}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {getOptionTypeDescription(carOption.type!)}
                    </p>
                  </div>
                </div>
                {parentName && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Parent
                    </p>
                    <Link href={`/car-options/${parentName}`}>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-accent"
                      >
                        {parentName}
                      </Badge>
                    </Link>
                  </div>
                )}
              </div>
              {carOption.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Description
                  </p>
                  <p className="text-sm">{carOption.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Media */}
          {(carOption.icon || carOption.image) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {carOption.icon && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Icon
                    </p>
                    <div className="flex items-center gap-4">
                      {carOption.icon.startsWith("http") ? (
                        <img
                          src={carOption.icon}
                          alt="Icon"
                          className="h-16 w-16 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : null}
                      <div>
                        <p className="text-sm font-mono">{carOption.icon}</p>
                        {carOption.icon.startsWith("http") && (
                          <a
                            href={carOption.icon}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 mt-1"
                          >
                            <LinkIcon className="h-3 w-3" />
                            Open in new tab
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {carOption.image && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Image
                    </p>
                    <div className="flex items-center gap-4">
                      {carOption.image.startsWith("http") ? (
                        <img
                          src={carOption.image}
                          alt="Image"
                          className="h-24 w-24 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : null}
                      <div>
                        <p className="text-sm font-mono">{carOption.image}</p>
                        {carOption.image.startsWith("http") && (
                          <a
                            href={carOption.image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 mt-1"
                          >
                            <LinkIcon className="h-3 w-3" />
                            Open in new tab
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 flex flex-col">
              <Button onClick={handleEdit} className="w-full justify-start">
                <Edit className="mr-2 h-4 w-4" />
                Edit Option
              </Button>
              {/* <Link href={`/car-options/create?parentId=${carOption.id}`}>
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Child Option
                </Button>
              </Link> */}
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteCarOptionMutation.isPending}
                className="w-full justify-start"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Option
              </Button>
            </CardContent>
          </Card>

          {/* Child Options */}
          {carOption.children && carOption.children.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Child Options</CardTitle>
                <CardDescription>
                  {carOption.children.length} child
                  {carOption.children.length > 1 ? "ren" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {carOption.children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between"
                  >
                    <Link href={`/car-options/${child.id}`}>
                      <span className="text-sm hover:text-blue-600 transition-colors">
                        {child.name}
                      </span>
                    </Link>
                    <Badge variant="outline">
                      {getOptionTypeLabel(child.type!)}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
