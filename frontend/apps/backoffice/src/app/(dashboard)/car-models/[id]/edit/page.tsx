import EditCarModelPage from "@/app/(dashboard)/car-models/_components/edit-page";
import React, { Suspense } from "react";

async function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditCarModelPage />
    </Suspense>
  );
}

export default Page;