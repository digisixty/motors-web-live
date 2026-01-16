import React from "react";
import { CarListingOptionDto, CarOptionType } from "@workspace/api";

interface CarOptionsProps {
  options?: CarListingOptionDto[];
}

interface OptionGroup {
  title: CarListingOptionDto;
  children: CarListingOptionDto[];
}

function CarOptions({ options = [] }: CarOptionsProps) {
  // Group options by parent
  const groupOptions = (): OptionGroup[] => {
    const groups: OptionGroup[] = [];
    const titleOptions = options.filter(
      (option) => option.carOptionType === CarOptionType.Title,
    );

    titleOptions.forEach((titleOption) => {
      const children = options.filter(
        (option) => option.carOptionParentId === titleOption.carOptionId,
      );
      groups.push({
        title: titleOption,
        children,
      });
    });

    // Also add root-level options (those without parents and not titles)
    const rootOptions = options.filter(
      (option) =>
        !option.carOptionParentId &&
        option.carOptionType !== CarOptionType.Title,
    );

    if (rootOptions.length > 0) {
      groups.push({
        title: { carOptionName: "General Options" } as CarListingOptionDto,
        children: rootOptions,
      });
    }

    return groups;
  };

  const renderOptionValue = (option: CarListingOptionDto) => {
    if (option.value === null || option.value === undefined) {
      return null;
    }

    switch (option.carOptionType) {
      case CarOptionType.Boolean:
        return option.value === "true" ? null : (
          <span className="text-red-600">✗ No</span>
        );
      case CarOptionType.String:
      case CarOptionType.Number:
      case CarOptionType.List:
        return <span className="text-gray-700">{option.value}</span>;
      case CarOptionType.Color:
        return (
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded border border-gray-300"
              style={{ backgroundColor: option.value }}
            />
            <span className="text-gray-700">{option.value}</span>
          </div>
        );
      default:
        return <span className="text-gray-700">{option.value}</span>;
    }
  };

  const renderOption = (
    option: CarListingOptionDto,
    isChild: boolean = false,
  ) => {
    const hasValue =
      option.value !== null &&
      option.value !== undefined &&
      option.value !== "";

    return (
      <div key={option.carOptionId} className={`${isChild ? "ml-6" : ""} mb-2`}>
        <div className="flex items-start justify-between border-b border-gray-100 py-2">
          <span className="font-medium text-gray-900">
            {option.carOptionName}
          </span>
          {hasValue && (
            <div className="text-right">{renderOptionValue(option)}</div>
          )}
        </div>
      </div>
    );
  };

  const groupedOptions = groupOptions();

  if (options.length === 0) {
    return (
      <div id="options" className="container mx-auto px-2 py-8">
        <h2 className="mb-6 text-2xl font-bold">Vehicle Options</h2>
        <p className="text-gray-500">No options available for this vehicle.</p>
      </div>
    );
  }

  return (
    <div id="options" className="container mx-auto px-2 py-8">
      <h2 className="mb-6 text-2xl font-bold">Vehicle Options</h2>

      <div className="">
        {groupedOptions.map((group, groupIndex) => (
          <div key={groupIndex} className="py-6">
            {/* Section Title */}
            <h3 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-800">
              {group.title.carOptionName}
            </h3>

            {/* Children Options */}
            <div className="space-y-1">
              {group.children.map((child) => renderOption(child, true))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CarOptions;
