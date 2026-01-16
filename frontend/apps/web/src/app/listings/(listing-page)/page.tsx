import { Metadata } from "next";
import ListingsPageClient from "./_components/listings-page-client";

export const metadata: Metadata = {
  title: "Inventory | Car Dealership",
};

function Page() {
  return <ListingsPageClient />;
}

export default Page;
