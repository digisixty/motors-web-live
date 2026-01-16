"use client";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { CDN_BASE_URL } from "@/constants/urls";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, MoveLeft, MoveRight } from "lucide-react";

const boxes = [
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/6B95093892A9494C9F5E4A5E8F19AF5B_7578D917BDC141C3A589D071967B8122_020-info-slider_16-9_3840x2160_01_SM22MODOX0006.jpeg`,
    title: "Stay Connected to Your Vehicle",
    desc: `MyAutoCare+ lets you access your car's essential information anytime.
              View details such as model specs, registration info, and service reminders
              all in one simple and secure app made exclusively for Mattheos Ioannou Motors customers.`,
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/7DB19AE57905453D8174567226DB402E_2B590ACD0A064C43AE9985F8D4CFCC38_020-info-slider_16-9_3840x2160_02_SM22J4COD0002.jpeg`,
    title: "Track Your 24-Month Warranty",
    desc: `Your vehicle's 24-month engine warranty activates automatically once your
              car is registered. MyAutoCare+ keeps you updated on your warranty period,
              coverage, and important terms, so you always know your engine is protected with confidence.`,
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/F6997596D21E4A52800593E87BFDEDCD_E56C9319524E437FADBB2E0F1D91469D_020-info-slider_16-9_3840x2160_03_VM19_2243.jpeg`,
    title: "Service Your Car with Trusted Experts",
    desc: `Book your car service directly through the app with one of our two approved
              mechanics who collaborate with Mattheos Ioannou Motors. Choose your workshop,
              schedule appointments, and manage your service history effortlessly.`,
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/87310679C03C426D9A7CDE20E8472F72_1DCC222787214AD7A5775430F7D992A7_020-info-slider_16-9_3840x2160_04_SM22MODPE0015.jpeg`,
    title: "More Features Coming Soon",
    desc: `MyAutoCare+ continues to grow with new tools built for your convenience.
              Soon you'll be able to access additional partner workshops, enhanced service
              tracking, and more exclusive features designed to make car ownership easier than ever.`,
  },
];

function BoxWithImage() {
  const [selectedBoxIndex, setselectedBoxIndex] = useState(1);

  // Mobile slider
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="container mx-auto px-4">
      <h2 className="px-4 pb-8 text-center text-2xl font-bold md:py-24">
        Myautocare+ App
      </h2>

      {/* Desktop view */}
      <div className="hidden md:block">
        <div className="relative h-[70vh] w-full overflow-hidden rounded-md">
          <Image
            key={boxes?.[selectedBoxIndex - 1]?.img || ""}
            src={boxes?.[selectedBoxIndex - 1]?.img ?? ""}
            alt="bg"
            fill
            className="bg-neutral-200 object-cover object-top"
            sizes="100vw"
          />
        </div>

        <div className="mt-8 flex w-full flex-col justify-stretch gap-4 lg:flex-row">
          {boxes?.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex-1 cursor-pointer rounded-md border border-transparent p-4 transition-colors",
                selectedBoxIndex === index + 1
                  ? "bg-neutral-200"
                  : "hover:border-neutral-200",
              )}
              onClick={() => {
                setselectedBoxIndex(index + 1);
              }}
            >
              <div className="font-heading mb-4">{item?.title}</div>
              <div className="text-xs">{item?.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile slider view */}
      <div className="md:hidden">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            className="flex size-10 items-center justify-center text-gray-700 transition-all duration-200 hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Previous slide"
          >
            <MoveLeft className="h-6 w-6" />
          </button>
          <button
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            className="flex size-10 items-center justify-center text-gray-700 transition-all duration-200 hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Next slide"
          >
            <MoveRight className="h-6 w-6" />
          </button>
        </div>

        <div className="relative">
          {/* Arrow buttons on top of slider */}

          <div className="overflow-hidden rounded-lg" ref={emblaRef}>
            <div className="flex">
              {boxes?.map((item, index) => (
                <div key={index} className="min-w-full">
                  {/* Big image at top */}
                  <div className="relative aspect-[4/3] h-full w-full overflow-hidden rounded-lg">
                    <Image
                      src={item?.img ?? ""}
                      alt={item?.title ?? ""}
                      fill
                      className="bg-neutral-200 object-cover"
                      sizes="100vw"
                    />
                  </div>

                  {/* Title and description below */}
                  <div className="mt-4 px-2">
                    <h3 className="mb-2 text-lg font-bold text-gray-900">
                      {item?.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-700">
                      {item?.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="mt-6 flex justify-center gap-2">
          {boxes?.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2.5 rounded-full transition-all duration-200 ${
                index === selectedIndex
                  ? "w-8 bg-gray-900"
                  : "w-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BoxWithImage;
