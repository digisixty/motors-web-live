import CreateCarAttributePage from "@/app/(dashboard)/car-attributes/_components/create-page";
import React, { Suspense } from "react";

async function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateCarAttributePage />
    </Suspense>
  );
}

export default Page;