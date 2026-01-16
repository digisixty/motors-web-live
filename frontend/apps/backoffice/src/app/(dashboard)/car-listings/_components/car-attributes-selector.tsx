"use client";

import { useState, useEffect } from "react";
import { useGetCarAttributes } from "@workspace/api";
import { CarAttributeType } from "@workspace/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Settings, Tag as TagIcon } from "lucide-react";
import { ColorInput } from "@/components/color-input";

export interface CarAttributeValue {
  carAttributeId: number;
  carAttributeName: string;
  carAttributeSlug: string;
  value: string;
}

interface CarAttributesSelectorProps {
  form: UseFormReturn<any>;
  fieldName: string;
  initialData?: CarAttributeValue[];
  disabled?: boolean;
}

export default function CarAttributesSelector({
  form,
  fieldName,
  initialData = [],
  disabled = false,
}: CarAttributesSelectorProps) {
  const [attributes, setAttributes] = useState<CarAttributeValue[]>([]);

  // Fetch all available car attributes
  const { data: carAttributesData, isLoading, error } = useGetCarAttributes();

  // Helper function to flatten all attributes including nested children
  const flattenAllAttributes = (attributes: any[]): any[] => {
    const flattened: any[] = [];

    const flatten = (attrs: any[]) => {
      attrs.forEach((attr) => {
        flattened.push(attr);
        if (attr.children && attr.children.length > 0) {
          flatten(attr.children);
        }
      });
    };

    flatten(attributes);
    return flattened;
  };

  // Initialize form values and attributes state when data is loaded
  useEffect(() => {
    if (carAttributesData && attributes.length === 0) {
      const rootAttributes = carAttributesData.filter((attr) => !attr.parentId);
      const allAttributes = flattenAllAttributes(rootAttributes);

      const initializedAttributes = allAttributes.map((attr) => {
        const existingValue = initialData.find(
          (existing) => existing.carAttributeId === attr.id
        );
        return {
          carAttributeId: attr.id!,
          carAttributeName: attr.name!,
          carAttributeSlug: attr.slug || attr.name!,
          value:
            existingValue?.value ||
            (attr.type === CarAttributeType.Boolean ? "false" : ""),
        };
      });
      setAttributes(initializedAttributes);

      // Set form values - use setValue with shouldValidate: false to prevent triggering re-renders
      form.setValue(fieldName, initializedAttributes, {
        shouldValidate: false,
      });
    }
  }, [carAttributesData]); // Remove dependencies that can cause infinite loops

  const renderAttributeInput = (
    attribute: any,
    currentValue: string,
    index: number,
    level: number = 0
  ) => {
    const isDisabled = disabled;
    const getIndentClass = (level: number) => {
      if (level === 0) return "";
      if (level === 1) return "ml-4 pl-4 border-l-2 border-gray-200";
      if (level === 2) return "ml-8 pl-4 border-l-2 border-gray-300";
      if (level === 3) return "ml-12 pl-4 border-l-2 border-gray-400";
      return "ml-16 pl-4 border-l-2 border-gray-500";
    };
    const indentClass = getIndentClass(level);

    switch (attribute.type) {
      case CarAttributeType.Boolean:
        return (
          <div key={attribute.id} className={indentClass}>
            <FormField
              control={form.control}
              name={`${fieldName}.${attributes.findIndex((attr) => attr.carAttributeId === attribute.id)}.value`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value === "true"}
                      onCheckedChange={(checked) => {
                        const newValue = checked ? "true" : "false";
                        field.onChange(newValue);
                      }}
                      disabled={isDisabled}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      {attribute.name}
                    </FormLabel>
                    {attribute.description && (
                      <p className="text-sm text-muted-foreground">
                        {attribute.description}
                      </p>
                    )}
                  </div>
                </FormItem>
              )}
            />
          </div>
        );

      case CarAttributeType.Number:
        return (
          <div key={attribute.id} className={indentClass}>
            <FormField
              control={form.control}
              name={`${fieldName}.${attributes.findIndex((attr) => attr.carAttributeId === attribute.id)}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    {attribute.name}
                    {attribute.description && (
                      <span className="text-muted-foreground font-normal ml-2">
                        {attribute.description}
                      </span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={`Enter ${attribute.name?.toLowerCase()}`}
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      disabled={isDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case CarAttributeType.List:
        return (
          <div key={attribute.id} className={indentClass}>
            <FormField
              control={form.control}
              name={`${fieldName}.${attributes.findIndex((attr) => attr.carAttributeId === attribute.id)}.value`}
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="text-sm font-medium">
                    {attribute.name}
                    {attribute.description && (
                      <span className="text-muted-foreground font-normal ml-2">
                        {attribute.description}
                      </span>
                    )}
                  </FormLabel>
                  <Select
                    value={field.value || ""}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    disabled={isDisabled}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={`Select ${attribute.name?.toLowerCase()}`}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {attribute.children?.map((child: any) => (
                        <SelectItem
                          key={child.id}
                          value={child.slug || child.name!}
                        >
                          {child.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case CarAttributeType.Color:
        return (
          <div key={attribute.id} className={indentClass}>
            <FormField
              control={form.control}
              name={`${fieldName}.${attributes.findIndex((attr) => attr.carAttributeId === attribute.id)}.value`}
              render={({ field }) => (
                <ColorInput
                  value={field.value || ""}
                  onChange={field.onChange}
                  label={attribute.name}
                  description={attribute.description}
                  disabled={isDisabled}
                />
              )}
            />
          </div>
        );

      case CarAttributeType.Title:
        return (
          <div key={attribute.id} className={indentClass}>
            <div className="py-2">
              <div className="text-sm font-medium">
                {attribute.name}
                {attribute.description && (
                  <span className="text-muted-foreground font-normal ml-2">
                    {attribute.description}
                  </span>
                )}
              </div>
            </div>
            {attribute.children && attribute.children.length > 0 && (
              <div className="mt-2 space-y-2">
                {attribute.children.map((child: any) => {
                  const childIndex = attributes.findIndex(
                    (attr) => attr.carAttributeId === child.id
                  );
                  return renderAttributeInput(
                    child,
                    attributes[childIndex]?.value || "",
                    childIndex,
                    level + 1
                  );
                })}
              </div>
            )}
          </div>
        );

      case CarAttributeType.String:
        return (
          <div key={attribute.id} className={indentClass}>
            <FormField
              control={form.control}
              name={`${fieldName}.${attributes.findIndex((attr) => attr.carAttributeId === attribute.id)}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    {attribute.name}
                    {attribute.description && (
                      <span className="text-muted-foreground font-normal ml-2">
                        {attribute.description}
                      </span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Enter ${attribute.name?.toLowerCase()}`}
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      disabled={isDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {attribute.children && attribute.children.length > 0 && (
              <div className="mt-2 space-y-2">
                {attribute.children.map((child: any) => {
                  const childIndex = attributes.findIndex(
                    (attr) => attr.carAttributeId === child.id
                  );
                  return renderAttributeInput(
                    child,
                    attributes[childIndex]?.value || "",
                    childIndex,
                    level + 1
                  );
                })}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Settings className="h-5 w-5" />
            Error Loading Attributes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">
            Failed to load car attributes: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || attributes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Vehicle Attributes
            <Skeleton className="h-4 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter out attributes that have children (they're parent categories)
  const rootAttributes =
    carAttributesData?.filter((attr) => !attr.parentId) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TagIcon className="h-5 w-5" />
          Vehicle Attributes
        </CardTitle>
        <CardDescription>
          Configure the specifications and features for this vehicle
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {rootAttributes.map((attribute, index) => (
            <div key={attribute.id} className="w-full">
              {renderAttributeInput(
                attribute,
                attributes[index]?.value || "",
                index
              )}
            </div>
          ))}
        </div>

        {rootAttributes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <TagIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">
              No attributes available
            </h3>
            <p className="text-sm">
              Create car attributes first to configure vehicle specifications.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
