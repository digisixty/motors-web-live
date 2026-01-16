"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CardProps {
  videoSrc: string;
  posterSrc: string;
  title: string;
  isHovered: boolean;
  onHover: () => void;
  onClick?: () => void;
}

export default function Card({
  videoSrc,
  posterSrc,
  title,
  isHovered,
  onHover,
  onClick,
}: CardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isHovered) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
      videoRef.current!.currentTime = 0; // reset
    }
  }, [isHovered]);

  return (
    <div
      className={cn(
        `relative h-[300px] w-[350px] cursor-pointer overflow-hidden transition-all duration-300 md:h-[450px] xl:h-[400px]`,
        isHovered
          ? "z-20 lg:h-[450px] lg:w-[600px] xl:h-[550px] xl:w-[450px]"
          : "",
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
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={videoSrc} />
      </video>

      {/* Text */}
      <div className="absolute bottom-3 left-4 text-lg font-semibold text-white drop-shadow-xl">
        {title}
      </div>
    </div>
  );
}
