import React, {
  ComponentPropsWithRef,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import { EmblaCarouselType } from "embla-carousel";
import { cn } from "@/lib/utils";

type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
  autoplayProgress: number;
};

export const useDotButton = (
  emblaApi: EmblaCarouselType | undefined,
  onButtonClick?: (emblaApi: EmblaCarouselType) => void,
  autoplayTime?: number
): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [autoplayProgress, setAutoplayProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressStartTimeRef = useRef<number>(0);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
      if (onButtonClick) onButtonClick(emblaApi);
    },
    [emblaApi, onButtonClick]
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const handleInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
    };

    const handleSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    handleInit();
    handleSelect();
    emblaApi
      .on("reInit", handleInit)
      .on("reInit", handleSelect)
      .on("select", handleSelect);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || !autoplayTime) return;

    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const startProgress = () => {
      progressStartTimeRef.current = Date.now();
      setAutoplayProgress(0);

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - progressStartTimeRef.current;
        const progress = Math.min((elapsed / autoplayTime) * 100, 100);
        setAutoplayProgress(progress);
      }, 50);
    };

    const resetProgress = () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setAutoplayProgress(0);
    };

    // Start progress tracking
    startProgress();

    // We'll use a different approach since autoplay plugin doesn't expose events
    // We'll reset progress when the slide changes
    const handleSelect = () => {
      resetProgress();
      startProgress();
    };

    emblaApi.on("select", handleSelect);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      emblaApi.off("select", handleSelect);
    };
  }, [emblaApi, autoplayTime]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
    autoplayProgress,
  };
};

type PropType = ComponentPropsWithRef<"button"> & {
  isSelected?: boolean;
  progress?: number;
};

export const DotButton: React.FC<PropType> = (props) => {
  const { children, isSelected, progress = 0, ...restProps } = props;

  return (
    <button
      type="button"
      className="bg-transparent border-0 p-0 m-0 size-6 flex items-center justify-center rounded-full relative cursor-pointer"
      {...restProps}
    >
      <span
        className={cn(
          "h-2 rounded-full transition-all duration-300",
          isSelected ? "w-5 bg-black" : "w-2 bg-neutral-500"
        )}
      ></span>

      {children}
    </button>
  );
};
