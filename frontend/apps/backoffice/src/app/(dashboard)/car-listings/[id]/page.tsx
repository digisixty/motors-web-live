import CarListingDetailPage from "@/app/(dashboard)/car-listings/_components/view-page";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <CarListingDetailPage id={id} />;
}

export default Page;