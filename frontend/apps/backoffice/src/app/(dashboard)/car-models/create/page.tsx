import CreateCarModelPage from "@/app/(dashboard)/car-models/_components/create-page";
import React, { Suspense } from "react";

async function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateCarModelPage />
    </Suspense>
  );
}

export default Page;