import CreateCarOptionPage from "@/app/(dashboard)/car-options/_components/create-page";
import React, { Suspense } from "react";

async function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateCarOptionPage />
    </Suspense>
  );
}

export default Page;