"use client";

import { useState, useEffect } from "react";
import { useGetCarOptions, CarOptionType } from "@workspace/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Settings, CheckSquare as CheckSquareIcon, CheckCheck } from "lucide-react";
import { ColorInput } from "@/components/color-input";

export interface CarOptionValue {
  carOptionId: number;
  carOptionName: string;
  carOptionSlug: string;
  value: string;
}

interface CarOptionsSelectorProps {
  form: UseFormReturn<any>;
  fieldName: string;
  initialData?: CarOptionValue[];
  disabled?: boolean;
}

export default function CarOptionsSelector({
  form,
  fieldName,
  initialData = [],
  disabled = false,
}: CarOptionsSelectorProps) {
  const [options, setOptions] = useState<CarOptionValue[]>([]);

  // Fetch all available car options
  const { data: carOptionsData, isLoading, error } = useGetCarOptions({});

  // Helper function to flatten all options including nested children
  const flattenAllOptions = (options: any[]): any[] => {
    const flattened: any[] = [];

    const flatten = (opts: any[]) => {
      opts.forEach((opt) => {
        flattened.push(opt);
        if (opt.children && opt.children.length > 0) {
          flatten(opt.children);
        }
      });
    };

    flatten(options);
    return flattened;
  };

  // Initialize form values and options state when data is loaded
  useEffect(() => {
    if (carOptionsData && options.length === 0) {
      const rootOptions = carOptionsData.filter((opt) => !opt.parentId);
      const allOptions = flattenAllOptions(rootOptions);

      const initializedOptions = allOptions.map((opt) => {
        const existingValue = initialData.find(
          (existing) => existing.carOptionId === opt.id
        );
        return {
          carOptionId: opt.id!,
          carOptionName: opt.name!,
          carOptionSlug: opt.slug || opt.name!,
          value:
            existingValue?.value ||
            (opt.type === CarOptionType.Boolean ? "false" : ""),
        };
      });
      setOptions(initializedOptions);

      // Set form values - use setValue with shouldValidate: false to prevent triggering re-renders
      form.setValue(fieldName, initializedOptions, {
        shouldValidate: false,
      });
    }
  }, [carOptionsData]); // Remove dependencies that can cause infinite loops

  const handleSelectAll = () => {
    const allOptions = flattenAllOptions(carOptionsData || []);
    const booleanOptions = allOptions.filter(
      (opt) => opt.type === CarOptionType.Boolean
    );

    booleanOptions.forEach((opt) => {
      const index = options.findIndex((o) => o.carOptionId === opt.id);
      if (index !== -1) {
        form.setValue(`${fieldName}.${index}.value`, "true");
      }
    });
  };

  const handleUnselectAll = () => {
    const allOptions = flattenAllOptions(carOptionsData || []);
    const booleanOptions = allOptions.filter(
      (opt) => opt.type === CarOptionType.Boolean
    );

    booleanOptions.forEach((opt) => {
      const index = options.findIndex((o) => o.carOptionId === opt.id);
      if (index !== -1) {
        form.setValue(`${fieldName}.${index}.value`, "false");
      }
    });
  };

  const renderOptionInput = (
    option: any,
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

    switch (option.type) {
      case CarOptionType.Boolean:
        return (
          <div key={option.id} className={indentClass}>
            <FormField
              control={form.control}
              name={`${fieldName}.${options.findIndex((opt) => opt.carOptionId === option.id)}.value`}
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
                      {option.name}
                    </FormLabel>
                    {option.description && (
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    )}
                  </div>
                </FormItem>
              )}
            />
          </div>
        );

      case CarOptionType.Number:
        return (
          <div key={option.id} className={indentClass}>
            <FormField
              control={form.control}
              name={`${fieldName}.${options.findIndex((opt) => opt.carOptionId === option.id)}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    {option.name}
                    {option.description && (
                      <span className="text-muted-foreground font-normal ml-2">
                        {option.description}
                      </span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={`Enter ${option.name?.toLowerCase()}`}
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

      case CarOptionType.List:
        return (
          <div key={option.id} className={indentClass}>
            <FormField
              control={form.control}
              name={`${fieldName}.${options.findIndex((opt) => opt.carOptionId === option.id)}.value`}
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="text-sm font-medium">
                    {option.name}
                    {option.description && (
                      <span className="text-muted-foreground font-normal ml-2">
                        {option.description}
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
                          placeholder={`Select ${option.name?.toLowerCase()}`}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {option.children?.map((child: any) => (
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

      case CarOptionType.Color:
        return (
          <div key={option.id} className={indentClass}>
            <FormField
              control={form.control}
              name={`${fieldName}.${options.findIndex((opt) => opt.carOptionId === option.id)}.value`}
              render={({ field }) => (
                <ColorInput
                  value={field.value || ""}
                  onChange={field.onChange}
                  label={option.name}
                  description={option.description}
                  disabled={isDisabled}
                />
              )}
            />
          </div>
        );

      case CarOptionType.Title:
        return (
          <div key={option.id} className={indentClass}>
            <div className="py-2">
              <div className="text-sm font-medium">
                {option.name}
                {option.description && (
                  <span className="text-muted-foreground font-normal ml-2">
                    {option.description}
                  </span>
                )}
              </div>
            </div>
            {option.children && option.children.length > 0 && (
              <div className="mt-2 space-y-2">
                {option.children.map((child: any) => {
                  const childIndex = options.findIndex(
                    (opt) => opt.carOptionId === child.id
                  );
                  return renderOptionInput(
                    child,
                    options[childIndex]?.value || "",
                    childIndex,
                    level + 1
                  );
                })}
              </div>
            )}
          </div>
        );

      case CarOptionType.String:
        return (
          <div key={option.id} className={indentClass}>
            <FormField
              control={form.control}
              name={`${fieldName}.${options.findIndex((opt) => opt.carOptionId === option.id)}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    {option.name}
                    {option.description && (
                      <span className="text-muted-foreground font-normal ml-2">
                        {option.description}
                      </span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Enter ${option.name?.toLowerCase()}`}
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

      default:
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Settings className="h-5 w-5" />
            Error Loading Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">
            Failed to load car options: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || options.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Vehicle Options
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

  // Filter out options that have children (they're parent categories)
  const rootOptions = carOptionsData?.filter((opt) => !opt.parentId) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquareIcon className="h-5 w-5" />
          Vehicle Options
        </CardTitle>
        <CardDescription>
          Configure the optional features and packages for this vehicle
        </CardDescription>
        {!disabled && (() => {
          const allOptions = flattenAllOptions(carOptionsData || []);
          const hasBooleanOptions = allOptions.some(
            (opt) => opt.type === CarOptionType.Boolean
          );
          return hasBooleanOptions ? (
            <div className="mt-2 flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="h-8"
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Select All
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleUnselectAll}
                className="h-8"
              >
                <CheckSquareIcon className="h-4 w-4 mr-2" />
                Unselect All
              </Button>
            </div>
          ) : null;
        })()}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {rootOptions.map((option, index) => (
            <div key={option.id} className="w-full">
              {renderOptionInput(option, options[index]?.value || "", index)}
            </div>
          ))}
        </div>

        {rootOptions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <CheckSquareIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No options available</h3>
            <p className="text-sm">
              Create car options first to configure vehicle optional features
              and packages.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
