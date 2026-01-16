import ContactSubmissionDetailPage from "@/app/(dashboard)/contact-submissions/_components/view-page";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <ContactSubmissionDetailPage id={id} />;
}

export default Page;