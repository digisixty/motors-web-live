"use client";
import { motion, AnimatePresence, useDragControls } from "motion/react";
import { useState, useEffect } from "react";
import { VideoItem } from "./types";
import { X } from "lucide-react";

interface VideoViewerProps {
  videos: VideoItem[];
  initialIndex: number;
  onClose: () => void;
}

export default function VideoViewer({
  videos,
  initialIndex,
  onClose,
}: VideoViewerProps) {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const dragControls = useDragControls();

  // Disable body scroll
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const next = () => {
    if (index < videos.length - 1) {
      setDirection(1);
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setDirection(-1);
      setIndex(index - 1);
    }
  };

  useEffect(() => {
    const handler = (e: WheelEvent | TouchEvent) => {
      if ("deltaY" in e) {
        if (e.deltaY > 40) next();
        if (e.deltaY < -40) prev();
      }
    };
    window.addEventListener("wheel", handler);
    return () => window.removeEventListener("wheel", handler);
  }, [index]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      {/* CLOSE */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white"
      >
        <X className="size-6" />
      </button>

      {/* SLIDES */}
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden py-8">
        <AnimatePresence mode="wait">
          <div className="flex h-full flex-col items-center">
            <motion.video
              key={videos?.[index]?.id}
              src={videos?.[index]?.videoSrc}
              autoPlay
              controls
              className="max-h-full w-full max-w-2xl object-contain"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.y < -100 && index < videos.length - 1) {
                  setDirection(1);
                  setIndex(index + 1);
                }
                if (info.offset.y > 100 && index > 0) {
                  setDirection(-1);
                  setIndex(index - 1);
                }
              }}
              initial={{ y: direction > 0 ? 200 : -200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: direction > 0 ? -200 : 200, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
