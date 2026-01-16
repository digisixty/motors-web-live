import NewsletterSubscriptionDetailPage from "@/app/(dashboard)/newsletter-subscriptions/_components/view-page";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <NewsletterSubscriptionDetailPage id={id} />;
}

export default Page;
