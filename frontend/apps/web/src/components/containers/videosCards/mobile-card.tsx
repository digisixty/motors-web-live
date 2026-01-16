"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CardProps {
  videoSrc: string;
  posterSrc: string;
  title: string;
  isActive: boolean;
  onHover: () => void;
  onClick?: () => void;
  className?: string;
}

export default function MobileCard({
  videoSrc,
  posterSrc,
  title,
  isActive,
  onHover,
  onClick,
  className,
}: CardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
      videoRef.current!.currentTime = 0; // reset
    }
  }, [isActive]);

  return (
    <div
      className={cn(
        `relative h-full w-full overflow-hidden rounded-2xl transition-all duration-300`,
        isActive ? "" : "",
        className,
      )}
      onMouseEnter={onHover}
      onClick={onClick}
    >
      {/* Thumbnail (shows only when video isn't playing) */}
      <Image
        src={posterSrc}
        alt={title}
        fill
        className="pointer-events-none object-cover"
      />

      {/* Video Layer */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        className={`absolute inset-0 top-0 right-0 bottom-0 left-0 h-full w-full object-cover transition-opacity duration-300 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={videoSrc} />
      </video>

      {/* Text */}
      <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black to-transparent px-4 pt-20 pb-4 text-lg">
        <div className="text-white">{title}</div>
      </div>
    </div>
  );
}
