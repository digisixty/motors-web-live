"use client";

import { useGetStaticContentBySlug } from "@workspace/api";
import StickyImageScroll from "@/components/containers/home-sections/sticky-image-scroll";

interface DynamicHomeSectionProps {
  slug: string;
  fallbackImageUrl: string;
}

export default function DynamicHomeSection({
  slug,
  fallbackImageUrl,
}: DynamicHomeSectionProps) {
  const { data: staticContent, isLoading } = useGetStaticContentBySlug(slug);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  // If no content found with this slug, don't render anything
  if (!staticContent) {
    return null;
  }

  return (
    <StickyImageScroll
      imageUrl={staticContent.mainImageAbsoluteUrl || fallbackImageUrl}
      title={staticContent.title || ""}
      description={staticContent.description || ""}
    />
  );
}
