import BlogDetailPage from "@/app/(dashboard)/blogs/_components/view-page";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <BlogDetailPage id={id} />;
}

export default Page;
