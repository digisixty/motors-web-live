"use client";

import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { CDN_BASE_URL } from "@/constants/urls";
import { Motorbike, Calendar, Euro } from "lucide-react";
import { useGetCarAttributes, type PublicCarListingDto } from "@workspace/api";
import { parseColorValue } from "@/lib/colorUtils";
import {
  ACCELERATION_0_100_KMH,
  CAR_TYPE,
  EXTERIOR_COLOR,
  INTERIOR_COLOR,
  MAX_LUGGAGE_CAPACITY,
  MAX_POWER,
  MAX_RANGE,
} from "@/constants/car-attributes";
import CountUp from "@/components/ui/count-up";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TestDriveForm } from "@/components/test-drive-form";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { formatPrice } from "@/lib/priceRenderer";

interface HeroSectionProps {
  carListing: PublicCarListingDto;
}

function HeroSection({ carListing }: HeroSectionProps) {
  const [isTestDriveModalOpen, setIsTestDriveModalOpen] = useState(false);
  const { data, isLoading } = useGetCarAttributes();

  const formatYear = (registrationDate: string | null | undefined) => {
    if (!registrationDate) return null;
    return new Date(registrationDate).getFullYear();
  };

  const handleTestDriveSuccess = () => {
    setIsTestDriveModalOpen(false);
  };

  const primaryImage =
    carListing.primaryImageAbsoluteUrl ||
    (carListing.primaryImage
      ? `${CDN_BASE_URL}${carListing.primaryImage}`
      : null);

  // const features = [
  //   {
  //     icon: Calendar,
  //     subTitle: formatYear(carListing.registrationDate) || "N/A",
  //     title: "Year",
  //   },
  //   {
  //     icon: Motorbike,
  //     subTitle: carListing.stockNumber || "N/A",
  //     title: "Stock Number",
  //   },
  //   {
  //     icon: Euro,
  //     subTitle: formatPrice(carListing.price) || "N/A",
  //     title:
  //       carListing.salePrice &&
  //       carListing.price &&
  //       carListing.salePrice < carListing.price
  //         ? "Original Price"
  //         : "Price",
  //   },
  // ];

  const interiorColor = carListing.carListingAttributes?.find(
    (a) => a.carAttributeSlug === INTERIOR_COLOR,
  );
  const exteriorColor = carListing.carListingAttributes?.find(
    (a) => a.carAttributeSlug === EXTERIOR_COLOR,
  );
  const maxPower = carListing.carListingAttributes?.find(
    (a) => a.carAttributeSlug === MAX_POWER,
  );
  const maxLuggageCapacity = carListing.carListingAttributes?.find(
    (a) => a.carAttributeSlug === MAX_LUGGAGE_CAPACITY,
  );
  const acceleration0100Kmh = carListing.carListingAttributes?.find(
    (a) => a.carAttributeSlug === ACCELERATION_0_100_KMH,
  );
  const carType = carListing.carListingAttributes?.find(
    (a) => a.carAttributeSlug === CAR_TYPE,
  );

  // Helper function to find an attribute by slug recursively in a nested structure
  const findBySlug = (
    items: typeof data | undefined,
    slug: string,
  ): NonNullable<typeof data>[number] | undefined => {
    for (const item of items || []) {
      if (item.slug === slug) return item;
      if (item.children && item.children.length > 0) {
        const found = findBySlug(item.children, slug);
        if (found) return found;
      }
    }
    return undefined;
  };

  const hybridInAttributes = findBySlug(data, "hybrid");

  const parsedInteriorColor = interiorColor?.value
    ? parseColorValue(interiorColor?.value)
    : undefined;
  const parsedExteriorColor = exteriorColor?.value
    ? parseColorValue(exteriorColor?.value)
    : undefined;

  return (
    <div className="container mx-auto flex w-full flex-col gap-2 overflow-hidden bg-white pr-2 pl-2 lg:flex-row lg:pl-8 xl:max-w-540! xl:pl-16 2xl:pl-24">
      {/* Left Section */}
      <div className="z-20 order-1 flex flex-col justify-between py-8 lg:order-0 lg:w-1/2 xl:w-1/3">
        {/* Title */}
        <div className="relative">
          <div className="flex items-center justify-between">
            {carListing.registrationDate && (
              <span className="text-sm text-gray-500">
                {formatYear(carListing.registrationDate)} Model
              </span>
            )}
            {/* Sold Badge */}
            {carListing.isSold && (
              <div className="absolute -top-7 -right-20 inline-flex items-center">
                <span className="rounded-full bg-red-600 px-4 py-1 text-sm font-medium text-gray-100 uppercase">
                  Sold
                </span>
              </div>
            )}
          </div>
          <h1 className="mt-2 flex items-center text-3xl font-bold">
            {carListing.manufacturerName} {carListing.carModelName}{" "}
            {carType?.value === "hybrid" &&
              hybridInAttributes?.absoluteIconUrl && (
                <span className="ml-4 inline-block h-8 w-8">
                  <Image
                    src={hybridInAttributes?.absoluteIconUrl}
                    width={32}
                    height={32}
                    alt="Hybrid"
                  />
                </span>
              )}
          </h1>

          {carListing.stockNumber && (
            <span className="text-sm text-gray-500">
              Stock #{carListing.stockNumber}
            </span>
          )}

          {/* Prices */}
          <div className="mt-4 flex items-baseline gap-3">
            {carListing.price &&
              carListing.salePrice &&
              carListing.salePrice < carListing.price && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(carListing.price)}
                </span>
              )}
            <span className="text-2xl font-semibold text-teal-600">
              {formatPrice(carListing.salePrice || carListing.price)}
            </span>
            {carListing.customPriceLabel && (
              <span className="text-sm text-gray-500">
                {carListing.customPriceLabel}
              </span>
            )}
          </div>

          {/* Special Offer Badge */}
          {carListing.isSpecialOffer && (
            <div className="mt-2 inline-flex items-center">
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
                Special Offer
              </span>
            </div>
          )}

          {/* Description */}
          <p className="mt-4 leading-relaxed text-gray-600">
            Discover the {carListing.manufacturerName} {carListing.carModelName}
            .{carListing.stockNumber && ` Stock #${carListing.stockNumber}.`}
            <br />
            Quality vehicles from Mattheos Ioannou Motors.
          </p>
        </div>

        {/* Attributes
        {carListing.carListingAttributes && carListing.carListingAttributes.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Key Features</h3>
            <div className="grid grid-cols-2 gap-4">
              {carListing.carListingAttributes.slice(0, 6).map((attribute) => (
                <div key={attribute.id} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-teal-600"></div>
                  <span className="text-sm text-gray-700">
                    {attribute.carAttributeName}: {attribute.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* Stats */}
        {/* <div className="mt-8 flex items-stretch gap-8">
          {features?.map(({ icon: Icon, title, subTitle }, index) => (
            <div
              key={index}
              className="flex w-1/3 flex-col items-center justify-start gap-2"
            >
              <Icon className="size-10" />
              <span className="text-xl font-semibold text-gray-800">
                {subTitle}
              </span>
              <span className="text-center text-xs text-gray-500">{title}</span>
            </div>
          ))}
        </div> */}

        <div className="mt-3 flex flex-col gap-4 md:flex-row">
          <div className="flex gap-2">
            {parsedInteriorColor && parsedInteriorColor.length > 0 ? (
              <>
                <div className="flex h-10 w-14 flex-col overflow-hidden rounded border">
                  {parsedInteriorColor.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex-1"
                      style={{
                        backgroundColor: color.hex,
                        height: `${100 / parsedInteriorColor.length}%`,
                      }}
                    />
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="text-xs text-neutral-700">Interior color</div>
                  <div className="text-sm font-bold">
                    {parsedInteriorColor
                      .filter((c) => c.text)
                      .map((c) => c.text)
                      .join(", ")}
                  </div>
                </div>
              </>
            ) : null}
          </div>

          <div className="flex gap-2">
            {parsedExteriorColor && parsedExteriorColor.length > 0 ? (
              <>
                <div className="flex h-10 w-14 flex-col overflow-hidden rounded border">
                  {parsedExteriorColor.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex-1"
                      style={{
                        backgroundColor: color.hex,
                        height: `${100 / parsedExteriorColor.length}%`,
                      }}
                    />
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="text-xs text-neutral-700">Exterior color</div>
                  <div className="text-sm font-bold">
                    {parsedExteriorColor
                      .filter((c) => c.text)
                      .map((c) => c.text)
                      .join(", ")}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>

        <div className="mt-3 flex items-start justify-center gap-2 text-center md:gap-4 lg:justify-start">
          {maxPower?.value && (
            <div className="flex shrink-0 flex-col items-center justify-center">
              <div className="text-3xl">
                <CountUp
                  to={maxPower?.value ? parseInt(maxPower?.value) : 0}
                  duration={2}
                  delay={2}
                />{" "}
                <span className="text-[9px] font-normal">
                  {maxPower?.value?.replace(/\d/g, "")}
                </span>
              </div>

              <div className="text-[9px] opacity-70 md:text-xs">Max. power</div>
            </div>
          )}
          {maxPower?.value && maxLuggageCapacity?.value && (
            <div className="pt-3 text-3xl font-extralight">/</div>
          )}
          {maxLuggageCapacity?.value && (
            <div className="flex shrink-0 flex-col items-center justify-center">
              <div className="text-3xl">
                <CountUp
                  to={
                    maxLuggageCapacity?.value
                      ? parseInt(maxLuggageCapacity?.value)
                      : 0
                  }
                  duration={2}
                  delay={2}
                />{" "}
                <span className="text-[9px] font-normal">liters</span>
              </div>
              <div className="text-[9px] opacity-70 md:text-xs">
                Max. luggage capacity
              </div>
            </div>
          )}
          {(maxPower?.value || maxLuggageCapacity?.value) &&
            acceleration0100Kmh?.value && (
              <div className="pt-3 text-3xl font-extralight">/</div>
            )}
          {acceleration0100Kmh?.value && (
            <div className="flex shrink-0 flex-col items-center justify-center">
              <div className="text-3xl">
                <CountUp
                  to={
                    acceleration0100Kmh?.value
                      ? parseInt(acceleration0100Kmh?.value)
                      : 0
                  }
                  duration={2}
                  delay={2}
                  decimals={1}
                />{" "}
                <span className="text-[9px] font-normal">s</span>
              </div>
              <div className="text-[9px] opacity-70 md:text-xs">
                Acceleration 0-100 km/h
              </div>
            </div>
          )}
        </div>
        {/* Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => setIsTestDriveModalOpen(true)}
            className="font-heading flex-1 rounded-xl bg-gray-900 px-5 py-3 text-white transition hover:bg-black disabled:opacity-50 lg:flex-initial"
            disabled={carListing.isSold}
          >
            {carListing.isSold ? "Sold" : "Test Drive"}
          </button>
          <button className="font-heading flex-1 rounded-xl border border-gray-300 px-5 py-3 transition hover:bg-gray-100 lg:flex-initial">
            Explore
          </button>
        </div>
      </div>

      {/* Right Section - Car Images Grid */}
      <Link
        href={`/listings/${carListing.slug}/gallery`}
        className="grid h-96 grid-cols-2 gap-0 md:grid-cols-2 lg:w-1/2 xl:h-[500px] xl:w-2/3 2xl:h-[600px]"
      >
        {/* Primary Image - Spans 2 rows on the left */}
        <div className="group relative col-span-2 cursor-pointer overflow-hidden md:col-span-1 md:row-span-2">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={`${carListing.manufacturerName} ${carListing.carModelName}`}
              fill
              className="bg-stone-300 object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 66vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-300">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
        </div>

        {/* Interior Image - Top right */}
        {carListing.absoluteInteriorImages &&
          carListing.absoluteInteriorImages.length > 0 && (
            <div className="group relative h-full w-full cursor-pointer overflow-hidden">
              <Image
                src={carListing.absoluteInteriorImages[0] ?? ""}
                alt={`${carListing.manufacturerName} ${carListing.carModelName} - Interior`}
                fill
                className="bg-stone-300 object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 33vw"
              />
              <div className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-xs text-white">
                Interior
              </div>
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
            </div>
          )}

        {/* Exterior Image - Bottom right */}
        {carListing.absoluteExteriorImages &&
          carListing.absoluteExteriorImages.length > 0 && (
            <div className="group relative h-full w-full cursor-pointer overflow-hidden">
              <Image
                src={carListing.absoluteExteriorImages[0] ?? ""}
                alt={`${carListing.manufacturerName} ${carListing.carModelName} - Exterior`}
                fill
                className="bg-stone-300 object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 33vw"
              />
              <div className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-xs text-white">
                Exterior
              </div>
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
            </div>
          )}

        {/* Fallback if no interior/exterior images */}
        {(!carListing.absoluteInteriorImages ||
          carListing.absoluteInteriorImages.length === 0) &&
          (!carListing.absoluteExteriorImages ||
            carListing.absoluteExteriorImages.length === 0) && (
            <>
              <div className="flex items-center justify-center bg-neutral-300">
                <span className="text-gray-500">No interior image</span>
              </div>
              <div className="flex items-center justify-center bg-neutral-300">
                <span className="text-gray-500">No exterior image</span>
              </div>
            </>
          )}
      </Link>

      {/* Test Drive Modal */}
      <Dialog
        open={isTestDriveModalOpen}
        onOpenChange={setIsTestDriveModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request a Test Drive</DialogTitle>
            <DialogDescription>
              Fill out the form below to schedule a test drive for the{" "}
              {carListing.manufacturerName} {carListing.carModelName}.
            </DialogDescription>
          </DialogHeader>
          <GoogleReCaptchaProvider
            reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          >
            <TestDriveForm
              carListingId={carListing.id}
              carListingName={`${carListing.manufacturerName} ${carListing.carModelName}`}
              onSubmitSuccess={handleTestDriveSuccess}
            />
          </GoogleReCaptchaProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default HeroSection;
