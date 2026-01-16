"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useGetCarAttributes } from "@workspace/api";
import { useCarListingQueryParams } from "@/hooks/useCarListingQueryParams";

function Sidebar() {
  const { data, isLoading } = useGetCarAttributes();
  const { getAttributeFilters, setAttributeFilter, isSold, setIsSold, isSpecialOffer, setIsSpecialOffer } =
    useCarListingQueryParams();

  const getFilterValue = (attributeId: number) => {
    const filters = getAttributeFilters();
    // Return empty string if no filter is set to match the "All" radio button value
    return filters[`attribute[${attributeId}]`] || "";
  };

  const updateFilter = (attributeId: number, value: string | null) => {
    setAttributeFilter(attributeId.toString(), value);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-1/2" />
      </div>
    );
  }
  return (
    <div className="h-full w-full">
      {/* Static Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="is-sold">Is Sold</Label>
          <Switch
            checked={isSold}
            onCheckedChange={setIsSold}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="is-special-offer">Special Offer</Label>
          <Switch
            checked={isSpecialOffer}
            onCheckedChange={setIsSpecialOffer}
          />
        </div>
      </div>

      <Accordion
        type="multiple"
        defaultValue={
          data?.[0]?.id?.toString() ? [data?.[0]?.id?.toString()] : ["item-0"]
        }
      >
        {data
          ?.filter((attribute) => attribute?.type === 4)
          .map((attribute, index) => (
            <AccordionItem
              key={attribute?.id}
              value={attribute?.id?.toString() || `$item-{${index}}`}
            >
              <AccordionTrigger>{attribute?.name}</AccordionTrigger>
              <AccordionContent>
                <RadioGroup
                  value={getFilterValue(attribute?.id || 0)}
                  onValueChange={(value) => {
                    updateFilter(attribute?.id || 0, value);
                  }}
                >
                  <div className="mb-2 flex items-center space-x-2">
                    <RadioGroupItem value="" id={`all-${attribute?.id}`} />
                    <Label htmlFor={`all-${attribute?.id}`}>All</Label>
                  </div>
                  {attribute?.children?.map((item, index2) => (
                    <div key={item?.id} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={item?.slug?.toString() || `$item-{${index2}}`}
                        id={item?.slug?.toString() || `$item-{${index2}}`}
                      />
                      <Label
                        htmlFor={item?.slug?.toString() || `$item-{${index2}}`}
                      >
                        {item?.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>
    </div>
  );
}

export default Sidebar;
