import React from "react";
import { CarListingAttributeDto } from "@workspace/api";
import { DISALLOWED_ATTRIBUTES } from "@/constants/car-attributes";

interface CarAttributesTableProps {
  attributes?: CarListingAttributeDto[];
}

function CarAttributesTable({ attributes }: CarAttributesTableProps) {
  if (!attributes || attributes.length === 0) {
    return null;
  }

  return (
    <div id="attributes" className="container mx-auto px-2 py-8">
      <h2 className="mb-6 text-2xl font-bold">Car attributes</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {attributes
          ?.filter((a) => !a.carAttributeParentId)
          ?.filter(
            (a) =>
              a.carAttributeSlug &&
              !DISALLOWED_ATTRIBUTES?.includes(a.carAttributeSlug),
          )
          ?.map((attribute, index) => (
            <div
              key={attribute.id || index}
              className="flex flex-col gap-2 border-b border-neutral-300 p-2"
            >
              <span className="text-xs font-medium text-gray-600 capitalize">
                {attribute.carAttributeName}
              </span>
              <span className="text-base font-bold text-gray-900">
                {attribute.value || "N/A"}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default CarAttributesTable;
