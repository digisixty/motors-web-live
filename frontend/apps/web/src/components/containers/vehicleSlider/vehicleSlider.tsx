import Image from "next/image";
import React from "react";
import { ReactNode } from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "@/components/containers/vehicleSlider/arrowButtons";
import PriceRenderer from "@/lib/priceRenderer";
import { isLightColor } from "@/lib/colorUtils";
import Link from "next/link";
import { CAR_DETAILS } from "@/constants/app-routes";

type SlideType = {
  slug: string;
  img: string;
  title: string;
  description: ReactNode;
  price: number;
  bgColor?: string;
  year: number;
  customPriceLabel?: string;
  cardFooterLabel?: string;
};

function VehicleSlider({
  slides,
  options,
}: {
  slides: SlideType[];
  options?: EmblaOptionsType;
}) {
  const autoplayTime = 4000;

  const modifiedOptions: EmblaOptionsType = {
    ...options,
    slidesToScroll: "auto",
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(modifiedOptions, [
    Autoplay({
      active: false,
      playOnInit: true,
      stopOnInteraction: false,
      delay: autoplayTime,
    }),
  ]);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="w-full select-none">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="touch-action-pan-y pinch-zoom flex">
          {slides.map((item, index) => (
            <Link
              href={`${CAR_DETAILS}/${item?.slug}`}
              className={`translate3d(0,0,0) w-full min-w-0 flex-[0_0_90%] transform pl-5 md:flex-[0_0_55%] lg:flex-[0_0_65%] xl:flex-[0_0_45%] 2xl:flex-[0_0_33%]`}
              key={index}
              style={{
                paddingRight: index === slides?.length - 1 ? "20px" : "0",
              }}
            >
              <div
                className="flex flex-col overflow-hidden rounded-md lg:flex-row"
                style={{
                  backgroundColor: item?.bgColor || "#ddd",
                  color: item?.bgColor
                    ? isLightColor(item.bgColor)
                      ? "black"
                      : "white"
                    : "black",
                }}
              >
                <div className="relative h-64 w-full overflow-hidden md:h-72 lg:h-96 lg:w-7/12">
                  {item?.customPriceLabel && (
                    <div className="absolute top-1 left-1 z-10 w-fit rounded bg-black px-2.5 py-0.5 text-xs text-white">
                      {item.customPriceLabel}
                    </div>
                  )}
                  <Image
                    src={item?.img}
                    alt={item?.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 90vw, (max-width: 1024px) 55vw, 45vw"
                  />
                  <div className="absolute right-0 bottom-0 left-0 z-10 flex h-10 items-center justify-center bg-linear-to-t from-black to-transparent px-2 text-xs text-white">
                    {item?.cardFooterLabel}
                  </div>
                </div>
                <div className="flex flex-1 shrink-0 flex-col justify-between p-6">
                  <div>
                    <div className="mb-2 text-xs">{item?.year}</div>
                    <div className="font-heading mb-4 font-bold">
                      {item?.title}
                    </div>
                    <div className="mb-5 text-sm">{item?.description}</div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="text-2xl">
                      <PriceRenderer price={item?.price} />
                    </div>
                    <div className="font-heading w-fit cursor-pointer rounded-xl bg-white px-7 py-3 pb-3.5 text-sm leading-5 font-bold text-black uppercase">
                      Buy
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
      </div>
    </section>
  );
}

export default VehicleSlider;
