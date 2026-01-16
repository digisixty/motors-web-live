"use client";

import { useState, useEffect } from "react";
import React from "react";
import { useGetCarAttributes, useDeleteCarAttribute } from "@workspace/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Edit,
  Trash,
  Plus,
  Eye,
  Calendar,
  Settings,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { CarAttributeType } from "@workspace/api";

export default function CarAttributesPage() {
  const [collapsedItems, setCollapsedItems] = useState<Set<number>>(new Set());

  const {
    data: carAttributesData,
    isLoading,
    error,
    refetch,
  } = useGetCarAttributes();

  // Initialize all parent attributes as collapsed when data loads
  useEffect(() => {
    if (carAttributesData) {
      const parentIds = new Set<number>();
      const findParentIds = (attributes: any[]) => {
        attributes.forEach((attr) => {
          if (attr.children && attr.children.length > 0) {
            parentIds.add(attr.id);
          }
        });
      };
      findParentIds(carAttributesData);
      setCollapsedItems(parentIds);
    }
  }, [carAttributesData]);

  const deleteCarAttributeMutation = useDeleteCarAttribute({
    mutation: {
      onSuccess: () => {
        toast.success("Car attribute deleted successfully");
        refetch();
      },
      onError: (error) => {
        toast.error("Failed to delete car attribute: " + error.message);
      },
    },
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this car attribute?")) {
      deleteCarAttributeMutation.mutate({ id });
    }
  };

  const toggleCollapse = (id: number) => {
    setCollapsedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const isCollapsed = (id: number) => {
    return collapsedItems.has(id);
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

  const renderAttributeRow = (attribute: any, level = 0) => {
    const hasChildren = attribute.children && attribute.children.length > 0;
    const collapsed = isCollapsed(attribute.id);

    return (
      <React.Fragment key={attribute.id}>
        <TableRow className={level > 0 ? "bg-stone-100 dark:bg-stone-800" : ""}>
          <TableCell className="font-medium">
            <div className="flex items-center gap-2">
              {level > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-400 ml-4" />
              )}
              {hasChildren && (
                <button
                  onClick={() => toggleCollapse(attribute.id)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  aria-label={
                    collapsed ? "Expand children" : "Collapse children"
                  }
                >
                  {collapsed ? (
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              )}
              {!hasChildren && level > 0 && <div className="w-6" />}
              <div className="max-w-[200px] truncate" title={attribute.name}>
                {attribute.name}
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Badge variant="secondary" className="max-w-[120px] truncate">
              {attribute.slug}
            </Badge>
          </TableCell>
          <TableCell>
            <Badge variant="outline">
              {getAttributeTypeLabel(attribute.type!)}
            </Badge>
          </TableCell>
          <TableCell>
            <div
              className="max-w-[300px] truncate text-sm text-muted-foreground"
              title={attribute.description || undefined}
            >
              {attribute.description || "-"}
            </div>
          </TableCell>
          <TableCell>
            {attribute.children && attribute.children.length > 0 ? (
              <Badge variant="secondary">
                {attribute.children.length} child
                {attribute.children.length > 1 ? "ren" : ""}
              </Badge>
            ) : (
              <span className="text-sm text-muted-foreground">-</span>
            )}
          </TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href={`/car-attributes/${attribute.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/car-attributes/${attribute.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                {attribute.type === CarAttributeType.List && (
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/car-attributes/create?parentId=${attribute.id}`}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Child
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDelete(attribute.id!)}
                  disabled={deleteCarAttributeMutation.isPending}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
        {!collapsed &&
          attribute.children?.map((child: any) =>
            renderAttributeRow(child, level + 1)
          )}
      </React.Fragment>
    );
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading car attributes: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Car Attributes</h1>
          <p className="text-muted-foreground">
            Manage your car attributes and their properties
          </p>
        </div>
        <Link href="/car-attributes/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Attribute
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Car Attributes
          </CardTitle>
          <CardDescription>
            A list of all car attributes in your system. Parent attributes can
            have child attributes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-full" />
              ))}
            </div>
          ) : carAttributesData && carAttributesData.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Children</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carAttributesData.map((attribute) =>
                    renderAttributeRow(attribute)
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Settings className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No car attributes yet
              </h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Get started by creating your first car attribute.
              </p>
              <Link href="/car-attributes/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Attribute
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
