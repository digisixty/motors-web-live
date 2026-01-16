import VideoViewer from "@/components/containers/socialMediaVideos/VideoViewer";
import React, { useState } from "react";
import { CDN_BASE_URL } from "@/constants/urls";
import { VideoItem } from "./types";
import CardsSlider from "@/components/containers/socialMediaVideos/cardsSlider/cardsSlider";

const videos: VideoItem[] = [
  {
    id: "1",
    title: "Luxury Car Showcase",
    hashtags: [
      "luxury",
      "cars",
      "showcase",
      "luxury",
      "cars",
      "showcase",
      "luxury",
      "cars",
      "showcase",
    ],
    videoSrc: `${CDN_BASE_URL}/cdn/static/heading-1-mobile.mp4`,
    posterSrc: "",
  },
  {
    id: "2",
    title: "Sports Car Performance",
    hashtags: ["sports", "performance", "speed"],
    videoSrc: `${CDN_BASE_URL}/cdn/static/samples/1763047273131.mp4`,
    posterSrc: "",
  },
  {
    id: "3",
    title: "Luxury Car Showcase",
    hashtags: [
      "luxury",
      "cars",
      "showcase",
      "luxury",
      "cars",
      "showcase",
      "luxury",
      "cars",
      "showcase",
    ],
    videoSrc: `${CDN_BASE_URL}/cdn/static/heading-1-mobile.mp4`,
    posterSrc: "",
  },
  {
    id: "4",
    title: "Sports Car Performance",
    hashtags: ["sports", "performance", "speed"],
    videoSrc: `${CDN_BASE_URL}/cdn/static/samples/1763047273131.mp4`,
    posterSrc: "",
  },
  {
    id: "5",
    title: "Luxury Car Showcase",
    hashtags: [
      "luxury",
      "cars",
      "showcase",
      "luxury",
      "cars",
      "showcase",
      "luxury",
      "cars",
      "showcase",
    ],
    videoSrc: `${CDN_BASE_URL}/cdn/static/heading-1-mobile.mp4`,
    posterSrc: "",
  },
  {
    id: "6",
    title: "Sports Car Performance",
    hashtags: ["sports", "performance", "speed"],
    videoSrc: `${CDN_BASE_URL}/cdn/static/samples/1763047273131.mp4`,
    posterSrc: "",
  },
];

function SocialMediaVideos() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  return (
    <>
      <CardsSlider
        slides={videos}
        onClick={(i) => {
          setCurrent(i);
          setOpen(true);
        }}
      />

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

export default SocialMediaVideos;
