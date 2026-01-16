import View from "./view";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <View id={id} />;
}

export default Page;
