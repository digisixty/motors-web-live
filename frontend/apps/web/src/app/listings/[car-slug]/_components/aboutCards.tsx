/* eslint-disable @next/next/no-img-element */
import { Calendar, Cog, Car, Paintbrush, Tag, MapPin } from "lucide-react";
import type { PublicCarListingDto } from "@workspace/api";
import { YEAR } from "@/constants/car-attributes";
import { formatPrice } from "@/lib/priceRenderer";

interface AboutCardsProps {
  carListing: PublicCarListingDto;
}

function AboutCards({ carListing }: AboutCardsProps) {
  const formatYear = (registrationDate: string | null | undefined) => {
    if (!registrationDate) return null;
    return new Date(registrationDate).getFullYear();
  };

  const year = carListing.carListingAttributes?.find(
    (a) => a.carAttributeSlug === YEAR,
  )?.value;

  // Base features that are always shown
  const baseFeatures = [
    {
      title: "Manufacturer",
      icon: <Car className="size-10" />,
      value: carListing.manufacturerName || "N/A",
    },
    {
      title: "Model",
      icon: <Tag className="size-10" />,
      value: carListing.carModelName || "N/A",
    },
    {
      title: "Year",
      icon: <Calendar className="size-10" />,
      value: year ? formatYear(year) : "N/A",
    },
    {
      title: "Price",
      icon: <Paintbrush className="size-10" />,
      value: formatPrice(carListing.salePrice || carListing.price) || "N/A",
    },
  ];

  // Add additional features from carListingAttributes if they exist
  const additionalFeatures =
    carListing.carListingAttributes
      ?.filter((a) => !a.carAttributeParentId)
      ?.slice(0, 2)
      .map((attribute) => ({
        title: attribute.carAttributeName || "Feature",
        icon: <Cog className="size-10" />,
        value: attribute.value || "N/A",
      })) || [];

  // Add stock number if available
  if (carListing.stockNumber) {
    additionalFeatures.push({
      title: "Stock Number",
      icon: <MapPin className="size-10" />,
      value: carListing.stockNumber,
    });
  }

  const features = [...baseFeatures, ...additionalFeatures].slice(0, 6);

  return (
    <div id="about" className="container mx-auto mt-20 px-2">
      <h2 className="text-2xl font-bold">About this car</h2>

      <div className="mt-10 grid grid-cols-3 flex-col gap-4 lg:grid-cols-6">
        {features?.map((item, index) => (
          <div
            key={index}
            className="flex flex-1 flex-col items-center justify-center gap-1 rounded-md border p-2 py-4"
          >
            <div className="text-[9px] tracking-wide text-gray-500 uppercase md:text-xs">
              {item?.title}
            </div>
            <div className="flex h-16 items-center justify-center text-gray-700">
              {item?.icon}
            </div>
            <div className="font-heading px-2 text-center text-sm font-bold">
              {item?.value}
            </div>
          </div>
        ))}
      </div>

      {/* Show all attributes if they exist */}
      {/* {carListing.carListingAttributes &&
        carListing.carListingAttributes.length > 6 && (
          <div className="mt-12">
            <h3 className="mb-4 text-lg font-semibold">All Features</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {carListing.carListingAttributes.map((attribute) => (
                <div
                  key={attribute.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className="h-2 w-2 shrink-0 rounded-full bg-teal-600"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {attribute.carAttributeName || "Feature"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {attribute.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}
    </div>
  );
}

export default AboutCards;
