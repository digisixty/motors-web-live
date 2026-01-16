import EditBlogPage from "@/app/(dashboard)/blogs/_components/edit-page";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <EditBlogPage id={id} />;
}

export default Page;
