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
import DateRenderer from "@/lib/dateRenderer";
import Link from "next/link";
import { NEWS_DETAIL } from "@/constants/app-routes";
import { cn } from "@/lib/utils";

type SlideType = {
  img: string;
  title: string;
  shortDesc: ReactNode;
  date: string;
  slug: string;
};

function NewsSlider({
  slides,
  options,
  imgClassName,
}: {
  slides: SlideType[];
  options?: EmblaOptionsType;
  imgClassName?: string;
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
      <div className="mt-4 mb-4 flex items-center justify-end gap-4">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="touch-action-pan-y pinch-zoom flex">
          {slides.map((item, index) => (
            <div
              className={`translate3d(0,0,0) w-full min-w-0 flex-[0_0_100%] transform pr-5 md:flex-[0_0_50%] lg:flex-[0_0_40%] xl:flex-[0_0_40%] 2xl:flex-[0_0_45%]`}
              key={index}
            >
              <Link href={`${NEWS_DETAIL}/${item?.slug}`}>
                <div className="flex flex-col gap-2 overflow-hidden">
                  <div
                    className={cn(
                      "relative h-52 w-full overflow-hidden rounded-md md:h-56 lg:h-60 xl:h-80",
                      imgClassName,
                    )}
                  >
                    <Image
                      src={item?.img}
                      alt={item?.title}
                      fill
                      className="rounded-md object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    />
                  </div>
                  <div className="mt-2">
                    <DateRenderer date={item?.date} />
                  </div>

                  <div className="line-clamp-2 font-bold">{item?.title}</div>
                  <div className="line-clamp-2 text-sm font-light">
                    {item?.shortDesc}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewsSlider;
