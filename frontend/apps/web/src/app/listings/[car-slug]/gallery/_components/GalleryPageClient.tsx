"use client";

import { notFound } from "next/navigation";
import { useGetCarListingBySlug } from "@workspace/api";
import HomeHeader1 from "@/components/containers/homeHeader1";
import Footer from "@/components/containers/footer1";
import CarImages from "@/app/listings/[car-slug]/_components/carImages";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function GalleryPageClient({ slug }: { slug: string }) {
  const { data: carListing, isLoading, error } = useGetCarListingBySlug(slug);

  if (isLoading) {
    return (
      <div>
        <HomeHeader1 variant="light" />
        <div className="container mx-auto px-2 py-8">
          <div className="animate-pulse">
            <div className="mb-4 h-8 w-1/3 rounded bg-gray-300"></div>
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

  return (
    <div>
      <HomeHeader1 variant="light" />

      <div className="container mx-auto px-2 py-8">
        {/* Back Button */}
        <Link
          href={`/listings/${carListing.slug}`}
          className="mb-6 inline-flex items-center gap-2 text-gray-600 transition hover:text-gray-900"
        >
          <ArrowLeft className="size-5" />
          <span>Back to vehicle</span>
        </Link>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {carListing.manufacturerName} {carListing.carModelName} - Gallery
          </h1>
          {carListing.stockNumber && (
            <p className="mt-2 text-gray-600">
              Stock #{carListing.stockNumber}
            </p>
          )}
        </div>

        {/* Gallery Component */}
        <CarImages
          interiorImages={carListing?.absoluteInteriorImages}
          exteriorImages={carListing?.absoluteExteriorImages}
        />
      </div>

      <Footer />
    </div>
  );
}
