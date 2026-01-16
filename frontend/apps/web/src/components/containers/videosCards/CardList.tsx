"use client";

import { useState } from "react";
import VideoViewer from "@/components/containers/socialMediaVideos/VideoViewer";
import { useGetSlidersAll, SliderPlacement } from "@workspace/api";
import type { PublicSliderDto } from "@workspace/api";
import type { VideoItem } from "@/components/containers/socialMediaVideos/types";
import Card from "./card";
import MobileCardSlider from "./MobileCardSlider";

// const mockData = [
//   {
//     id: "1",
//     title: "sdsdsd",
//     videoAbsoluteUrl:
//       "https://mattheosioannoumotors.com/cdn/2025/12/Porsche_Gts_2023_20251226080533_3b4922c5.mp4",
//     imageAbsoluteUrl:
//       "https://mattheosioannoumotors.com/cdn/2025/12/9Z8A1193_20251226080855_42300859.jpg",
//   },
//   {
//     id: "1",
//     title: "sdsdsd",
//     videoAbsoluteUrl:
//       "https://mattheosioannoumotors.com/cdn/2025/12/Toyota_Rav4_Sky_Blue_2023_20251226154045_b65ef193.mp4",
//     imageAbsoluteUrl:
//       "https://mattheosioannoumotors.com/cdn/2025/12/9Z8A3274_20251223134314_15353a95.jpg",
//   },
//   {
//     id: "1",
//     title: "sdsdsd",
//     videoAbsoluteUrl:
//       "https://mattheosioannoumotors.com/cdn/2025/12/Mercedes_Benz_2023_Glc_20251226153755_a4de71c1.mp4",
//     imageAbsoluteUrl:
//       "https://mattheosioannoumotors.com/cdn/2025/12/9Z8A0908_20251226153724_09a512d5.jpg",
//   },
//   {
//     id: "1",
//     title: "sdsdsd",
//     videoAbsoluteUrl:
//       "https://mattheosioannoumotors.com/cdn/2025/12/Porsche_Gts_2021_20251226153849_5cf59e58.mp4",
//     imageAbsoluteUrl:
//       "https://mattheosioannoumotors.com/cdn/2025/12/9Z8A5996_20251226153948_59db03aa.jpg",
//   },
//   {
//     id: "1",
//     title: "sdsdsd",
//     videoAbsoluteUrl:
//       "https://mattheosioannoumotors.com/cdn/2025/12/Mercedes_Benz_-_Gclass_G400d_20251226154558_09f42093.mp4",
//     imageAbsoluteUrl:
//       "https://mattheosioannoumotors.com/cdn/2025/12/Screenshot_2025-12-26_174246_20251226154320_fcdf6982.png",
//   },
// ];
export default function CardList() {
  const { data: sliders = [] } = useGetSlidersAll({
    placement: SliderPlacement.Reels,
  });

  const [hoveredIndex, setHoveredIndex] = useState(0); // Initially hover the first item
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  // Transform slider data to match Card and VideoItem props
  const videos = sliders.map((slider: PublicSliderDto) => ({
    id: slider.id?.toString() ?? "",
    title: slider.title ?? "",
    videoSrc: slider.videoAbsoluteUrl ?? "",
    posterSrc: slider.imageAbsoluteUrl ?? "",
    hashtags: [] as string[],
  })) satisfies VideoItem[];

  return (
    <>
      {/* Mobile Slider */}
      <div className="md:hidden">
        <MobileCardSlider
          videos={videos}
          onHover={setHoveredIndex}
          onCardClick={(index) => {
            setCurrent(index);
            setOpen(true);
          }}
        />
      </div>

      {/* Desktop Grid */}
      <div className="hidden items-center gap-4 px-6 md:grid md:grid-cols-2 lg:flex lg:h-[500px] lg:flex-row xl:py-12">
        {videos.map((item, index) => (
          <Card
            key={item.id}
            {...item}
            isHovered={hoveredIndex === index}
            onHover={() => setHoveredIndex(index)}
            onClick={() => {
              setCurrent(index);
              setOpen(true);
            }}
          />
        ))}
      </div>

      {open && (
        <VideoViewer
          videos={videos}
          initialIndex={current}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
