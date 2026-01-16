"use client";

import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
}

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative mx-auto h-full w-auto max-w-7xl overflow-hidden rounded-lg bg-black">
      <video
        ref={videoRef}
        src={videoUrl}
        className="h-full w-full object-cover"
        muted={isMuted}
        controls={false}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      <div className="absolute right-4 bottom-4 flex gap-2">
        <button
          onClick={toggleMute}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/90 text-black transition-colors hover:bg-white"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="h-6 w-6" />
          ) : (
            <Volume2 className="h-6 w-6" />
          )}
        </button>
        <button
          onClick={togglePlayPause}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/90 text-black transition-colors hover:bg-white"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" fill="currentColor" />
          ) : (
            <Play className="h-6 w-6 fill-black" />
          )}
        </button>
      </div>
    </div>
  );
}
