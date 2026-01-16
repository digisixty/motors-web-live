import { Metadata } from "next";
import GalleryPageClient from "./_components/GalleryPageClient";

// Server component to handle async metadata generation
export async function generateMetadata({
  params,
}: {
  params: { "car-slug": string };
}): Promise<Metadata> {
  const slug = await params["car-slug"];

  try {
    const title = "Gallery | Mattheos Ioannou Motors";
    const description = "View our car image gallery.";

    return {
      title,
      description,
    };
  } catch (error) {
    return {
      title: "Gallery | Mattheos Ioannou Motors",
      description: "View our car image gallery.",
    };
  }
}

async function Page({ params }: { params: Promise<{ "car-slug": string }> }) {
  const { "car-slug": slug } = await params;

  return <GalleryPageClient slug={slug} />;
}

export default Page;
