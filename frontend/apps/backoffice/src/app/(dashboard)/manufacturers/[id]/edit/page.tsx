import EditManufacturerPage from "@/app/(dashboard)/manufacturers/_components/edit-page";
import React, { Suspense } from "react";

async function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditManufacturerPage />
    </Suspense>
  );
}

export default Page;