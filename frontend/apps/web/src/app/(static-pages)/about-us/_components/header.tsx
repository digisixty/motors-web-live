import Image from "next/image";
import React from "react";
import HomeHeader1 from "@/components/containers/homeHeader1";
import { CDN_BASE_URL } from "@/constants/urls";

function AboutUsHeader() {
  return (
    <>
      <HomeHeader1 variant="transparent" className="absolute top-0 z-50" />
      <div className="relative h-[50vh] md:h-[80vh]">
        <Image
          src={`${CDN_BASE_URL}/cdn/static/sliderbg1.jpg`}
          alt="bg"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />

        <div className="absolute right-0 bottom-0 left-0 z-20 flex h-44 flex-col items-start justify-end gap-2 bg-linear-to-t from-black to-transparent px-6 py-6 pb-16 lg:px-12 xl:px-24">
          <h1 className="text-5xl text-white">About us</h1>
          <div className="text-white">Mattheos Motors</div>
        </div>
      </div>
    </>
  );
}

export default AboutUsHeader;
