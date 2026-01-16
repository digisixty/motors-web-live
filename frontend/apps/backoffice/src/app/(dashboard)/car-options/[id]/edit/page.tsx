import EditCarOptionPage from "@/app/(dashboard)/car-options/_components/edit-page";
import React, { Suspense } from "react";

async function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditCarOptionPage />
    </Suspense>
  );
}

export default Page;