"use client";

import AboutCards from "@/app/listings/[car-slug]/_components/aboutCards";
import HeroSection from "@/app/listings/[car-slug]/_components/hero";
import HomeHeader1 from "@/components/containers/homeHeader1";
import { notFound } from "next/navigation";
import { useGetCarListingBySlug } from "@workspace/api";
import CarOptions from "@/app/listings/[car-slug]/_components/carOptions";
import CarAttributesTable from "@/app/listings/[car-slug]/_components/carAttributesTable";
import VideoPlayer from "@/app/listings/[car-slug]/_components/videoPlayer";
import Warranty from "@/app/listings/[car-slug]/_components/warranty";
import SectionNav from "@/components/SectionNav";
import Footer from "@/components/containers/footer1";
import RelatedCars from "@/app/listings/[car-slug]/_components/RelatedCars";
import { WARRANTY } from "@/constants/car-attributes";
import { useState } from "react";
import DOMPurify from "isomorphic-dompurify";

const getSections = (
  hasVideo: boolean,
  hasRelatedVehicles: boolean,
  hasDescription: boolean,
) => {
  const allSections = [
    { id: "about", label: "About this car" },
    { id: "attributes", label: "Car attributes" },
    { id: "options", label: "Vehicle Options" },
  ];

  if (hasVideo) {
    allSections.push({ id: "video", label: "Video" });
  }

  allSections.push({ id: "warranty", label: "Warranty" });

  if (hasDescription) {
    allSections.push({ id: "description", label: "Description" });
  }

  if (hasRelatedVehicles) {
    allSections.push({ id: "related", label: "Related Vehicles" });
  }

  return allSections;
};

// Create a client component for the data fetching
export default function CarListingPageClient({ slug }: { slug: string }) {
  const { data: carListing, isLoading, error } = useGetCarListingBySlug(slug);
  const [hasRelatedVehicles, setHasRelatedVehicles] = useState(false);

  if (isLoading) {
    return (
      <div>
        <HomeHeader1 variant="light" />
        <div className="container mx-auto px-2 py-8">
          <div className="animate-pulse">
            <div className="mb-4 h-8 w-1/3 rounded bg-gray-300"></div>
            <div className="mb-4 h-12 w-1/2 rounded bg-gray-300"></div>
            <div className="mb-4 h-64 rounded bg-gray-300"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !carListing) {
    return notFound();
  }

  const warranty = carListing?.carListingAttributes?.find(
    (a) => a.carAttributeSlug === WARRANTY,
  );

  const hasVideo = Boolean(
    carListing?.absoluteVideos && carListing.absoluteVideos.length > 0,
  );
  const hasDescription = Boolean(
    carListing?.description && carListing.description.length > 0,
  );
  const sections = getSections(hasVideo, hasRelatedVehicles, hasDescription);

  // Generate dynamic metadata based on the car listing data
  // const title = `${carListing.manufacturerName} ${carListing.carModelName} | Mattheos Ioannou Motors`;
  // const description = `Explore the ${carListing.manufacturerName} ${carListing.carModelName}. ${carListing.stockNumber ? `Stock #${carListing.stockNumber}.` : ""} Mattheos Ioannou Motors brings you quality vehicles.`;

  return (
    <div className="space-y-14">
      <HomeHeader1 variant="light" />

      <div>
        <HeroSection carListing={carListing} />
      </div>

      <SectionNav sections={sections} />

      <div>
        <AboutCards carListing={carListing} />
      </div>

      <div>
        <CarAttributesTable attributes={carListing?.carListingAttributes} />
      </div>

      {carListing?.description && carListing.description.length > 0 && (
        <section
          id="description"
          className="container mx-auto bg-black px-8 py-4 xl:p-16"
        >
          <h2 className="font-heading mb-6 text-2xl font-bold text-gray-100">
            Description
          </h2>
          <div
            className="prose prose-invert max-w-none text-gray-100"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(carListing.description || ""),
            }}
          />
        </section>
      )}

      <div>
        <CarOptions options={carListing?.carListingOptions} />
      </div>

      {carListing?.absoluteVideos && carListing.absoluteVideos.length > 0 && (
        <section id="video" className="container mx-auto px-4">
          <h2 className="font-heading mb-10 text-2xl font-bold text-gray-900">
            Video
          </h2>
          <div className="space-y-4">
            {carListing.absoluteVideos.map((videoUrl, index) => (
              <VideoPlayer key={index} videoUrl={videoUrl} />
            ))}
          </div>
        </section>
      )}

      <div>
        <Warranty
          value={warranty?.value || undefined}
          description={warranty?.carAttributeDescription || undefined}
        />
      </div>

      <div className="container mx-auto px-4">
        <RelatedCars
          currentCarSlug={carListing.slug}
          manufacturerId={carListing.manufacturerId}
          onHasContent={setHasRelatedVehicles}
        />
      </div>

      <Footer />
    </div>
  );
}
