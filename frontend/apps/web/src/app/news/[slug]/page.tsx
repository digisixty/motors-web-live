import React from "react";
import { Metadata } from "next";
import NewsDetails from "@/app/news/[slug]/NewsDetails";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // TODO: Fetch the blog data to generate dynamic metadata
  return {
    title: "News | Car Dealership",
  };
}

function page({ params }: { params: { slug: string } }) {
  return <NewsDetails />;
}

export default page;