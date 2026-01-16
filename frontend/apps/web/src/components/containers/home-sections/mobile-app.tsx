"use client";

import Image from "next/image";
import { CDN_BASE_URL } from "@/constants/urls";
import Link from "next/link";
import React from "react";
import GooglePlayBadgeLogoWineIcon from "@/assets/icons/Google_Play-Badge-Logo.wine.svg";
import AppStoreIOSBadgeLogoWineIcon from "@/assets/icons/App_Store_(iOS)-Badge-Logo.wine.svg";
import { useGetStaticContentBySlug } from "@workspace/api";
import { STATIC_CONTENT_SLUG_MOBILE_APP } from "@/constants/car-attributes";

function MobileAppSection() {
  const { data: staticContent, isLoading } = useGetStaticContentBySlug(
    STATIC_CONTENT_SLUG_MOBILE_APP,
  );

  if (isLoading) {
    return (
      <div className="container mx-auto flex flex-col gap-12 px-4 py-12">
        <div className="flex justify-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  const title =
    staticContent?.title ||
    "Handle your car details and secure your mechanic appointments easily using MyAutoCare+";
  const description =
    staticContent?.description || "Download now and stay connected.";
  const imageUrl =
    staticContent?.mainImageAbsoluteUrl ||
    `${CDN_BASE_URL}/cdn/static/samples/image-20240905-140742.png`;

  return (
    <div className="container mx-auto flex flex-col gap-12 px-4">
      <h2 className="mx-auto max-w-md text-center text-2xl xl:text-3xl">
        {title}
      </h2>

      <p className="text-center">{description}</p>

      <div className="mx-auto flex max-w-md flex-row items-center justify-center gap-12">
        <Link href="#">
          <GooglePlayBadgeLogoWineIcon className="-mx-6 -my-10 h-32 w-auto" />
        </Link>
        <Link href="#">
          <AppStoreIOSBadgeLogoWineIcon className="-mx-10 -my-10 h-30 w-auto" />
        </Link>
      </div>
      <div className="relative mx-auto h-full w-full max-w-md">
        <Image
          src={imageUrl}
          alt="mobile"
          width={512}
          height={512}
          className="w-full"
        />
      </div>
    </div>
  );
}

export default MobileAppSection;
