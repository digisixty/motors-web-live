"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import Card from "./card";
import type { VideoItem } from "@/components/containers/socialMediaVideos/types";
import { Play, Pause } from "lucide-react";
import MobileCard from "./mobile-card";
import { cn } from "@/lib/utils";

interface MobileCardSliderProps {
  videos: VideoItem[];
  onHover: (index: number) => void;
  onCardClick: (index: number) => void;
}

export default function MobileCardSlider({
  videos,
  onHover,
  onCardClick,
}: MobileCardSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: false,
      align: "center",
    },
    [Autoplay({ delay: 3000, stopOnInteraction: true })],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const toggleAutoplay = useCallback(() => {
    if (!emblaApi) return;
    const autoplay = emblaApi.plugins()?.autoplay;
    if (!autoplay) return;

    if (isPlaying) {
      autoplay.stop();
      setIsPlaying(false);
    } else {
      autoplay.play();
      setIsPlaying(true);
    }
  }, [emblaApi, isPlaying]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {videos.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "h-[600px] flex-[0_0_85%]",
                index === 0
                  ? "pl-[calc(50%-45vw)]"
                  : index === videos.length - 1
                    ? "pr-[calc(50%-45vw)]"
                    : "",
              )}
            >
              <MobileCard
                videoSrc={item?.videoSrc}
                posterSrc={item?.posterSrc}
                title={item.title}
                isActive={selectedIndex === index}
                onHover={() => onHover(index)}
                onClick={() => onCardClick(index)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        {/* Dots with Play/Pause */}
        <div className="flex w-fit items-center justify-center gap-2 rounded-full bg-zinc-700 p-4">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all ${
                selectedIndex === index ? "w-6 bg-white" : "w-2 bg-zinc-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={toggleAutoplay}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 transition-opacity hover:bg-white/90"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 text-white" />
          ) : (
            <Play className="h-4 w-4 text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
