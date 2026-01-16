import React from "react";
import { Metadata } from "next";
import Locations from "@/app/(static-pages)/(with-header-footer)/find-us/find-us";

export const metadata: Metadata = {
  title: "Find us | Car Dealership",
};

function Page() {
  return <Locations />;
}

export default Page;
