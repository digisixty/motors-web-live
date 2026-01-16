import EditPage from "./edit";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <EditPage id={id} />;
}

export default Page;
