import { Metadata } from "next";
import CarListingPageClient from "@/app/listings/[car-slug]/_components/CarListingPageClient";

// Server component to handle async metadata generation
export async function generateMetadata({
  params,
}: {
  params: { "car-slug": string };
}): Promise<Metadata> {
  const slug = await params["car-slug"];

  try {
    // For static metadata generation, we'll use a fallback
    // In a real app, you might want to fetch data here or use a different approach
    const title = "Car Listing | Mattheos Ioannou Motors";
    const description = "Discover quality vehicles at Mattheos Ioannou Motors.";

    return {
      title,
      description,
    };
  } catch (error) {
    return {
      title: "Car Listing | Mattheos Ioannou Motors",
      description: "Discover quality vehicles at Mattheos Ioannou Motors.",
    };
  }
}

async function Page({ params }: { params: Promise<{ "car-slug": string }> }) {
  const { "car-slug": slug } = await params;

  return <CarListingPageClient slug={slug} />;
}

export default Page;
