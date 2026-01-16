"use client";

import { useState, useEffect } from "react";
import React from "react";
import { useGetCarOptions, useDeleteCarOption } from "@workspace/api";
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
  CheckSquare,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { CarOptionType } from "@workspace/api";

export default function CarOptionsPage() {
  const [collapsedItems, setCollapsedItems] = useState<Set<number>>(new Set());

  const {
    data: carOptionsData,
    isLoading,
    error,
    refetch,
  } = useGetCarOptions({});

  // Initialize all parent options as collapsed when data loads
  useEffect(() => {
    if (carOptionsData) {
      const parentIds = new Set<number>();
      const findParentIds = (options: any[]) => {
        options.forEach((opt) => {
          if (opt.children && opt.children.length > 0) {
            parentIds.add(opt.id);
          }
        });
      };
      findParentIds(carOptionsData);
      setCollapsedItems(parentIds);
    }
  }, [carOptionsData]);

  const deleteCarOptionMutation = useDeleteCarOption({
    mutation: {
      onSuccess: () => {
        toast.success("Car option deleted successfully");
        refetch();
      },
      onError: (error) => {
        toast.error("Failed to delete car option: " + error.message);
      },
    },
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this car option?")) {
      deleteCarOptionMutation.mutate({ id });
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

  const renderOptionRow = (option: any, level = 0) => {
    const hasChildren = option.children && option.children.length > 0;
    const collapsed = isCollapsed(option.id);

    return (
      <React.Fragment key={option.id}>
        <TableRow className={level > 0 ? "bg-stone-100 dark:bg-stone-800" : ""}>
          <TableCell className="font-medium">
            <div className="flex items-center gap-2">
              {level > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-400 ml-4" />
              )}
              {hasChildren && (
                <button
                  onClick={() => toggleCollapse(option.id)}
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
              <div className="max-w-[200px] truncate" title={option.name}>
                {option.name}
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Badge variant="secondary" className="max-w-[120px] truncate">
              {option.slug}
            </Badge>
          </TableCell>
          <TableCell>
            <Badge variant="outline">{getOptionTypeLabel(option.type!)}</Badge>
          </TableCell>
          <TableCell>
            <div
              className="max-w-[300px] truncate text-sm text-muted-foreground"
              title={option.description || undefined}
            >
              {option.description || "-"}
            </div>
          </TableCell>
          <TableCell>
            {option.children && option.children.length > 0 ? (
              <Badge variant="secondary">
                {option.children.length} child
                {option.children.length > 1 ? "ren" : ""}
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
                  <Link href={`/car-options/${option.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/car-options/${option.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                {(option.type === CarOptionType.List ||
                  option.type === CarOptionType.Title) && (
                  <DropdownMenuItem asChild>
                    <Link href={`/car-options/create?parentId=${option.id}`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Child
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDelete(option.id!)}
                  disabled={deleteCarOptionMutation.isPending}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
        {!collapsed &&
          option.children?.map((child: any) =>
            renderOptionRow(child, level + 1)
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
              Error loading car options: {error.message}
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
          <h1 className="text-3xl font-bold tracking-tight">Car Options</h1>
          <p className="text-muted-foreground">
            Manage your car options and their properties
          </p>
        </div>
        <Link href="/car-options/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Option
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Car Options
          </CardTitle>
          <CardDescription>
            A list of all car options in your system. Parent options can have
            child options.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-full" />
              ))}
            </div>
          ) : carOptionsData && carOptionsData.length > 0 ? (
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
                  {carOptionsData.map((option) => renderOptionRow(option))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No car options yet</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Get started by creating your first car option.
              </p>
              <Link href="/car-options/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Option
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
