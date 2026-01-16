/* eslint-disable @next/next/no-img-element */
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "@/components/containers/vehicleSlider/arrowButtons";
import { cn } from "@/lib/utils";
import { VideoItem } from "@/components/containers/socialMediaVideos/types";
import { Play } from "lucide-react";

function CardsSlider({
  slides,
  options,
  imgClassName,
  onClick,
}: {
  slides: VideoItem[];
  options?: EmblaOptionsType;
  imgClassName?: string;
  onClick?: (index: number) => void;
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
              className={`translate3d(0,0,0) w-full min-w-0 flex-[0_0_80%] transform pr-5 md:flex-[0_0_40%] lg:flex-[0_0_33%] xl:flex-[0_0_25%] 2xl:flex-[0_0_25%]`}
              key={item?.id}
              onClick={() => onClick?.(index)}
            >
              <div className="flex flex-col gap-2 overflow-hidden">
                <div
                  className={cn(
                    "relative h-96 w-full rounded-md 2xl:h-[500px]",
                    imgClassName,
                  )}
                >
                  <video
                    src={item.videoSrc}
                    className="h-full w-full rounded-md object-cover"
                    muted
                  />
                  <div className="absolute right-3 bottom-3 flex size-10 items-center justify-center rounded-full bg-white">
                    <Play className="size-4 stroke-neutral-600" />
                  </div>
                </div>

                <div className="line-clamp-2 font-bold">{item?.title}</div>
                <div className="flex flex-wrap gap-2 gap-y-1">
                  {item.hashtags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CardsSlider;
