import CreateManufacturerPage from "@/app/(dashboard)/manufacturers/_components/create-page";
import React, { Suspense } from "react";

async function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateManufacturerPage />
    </Suspense>
  );
}

export default Page;