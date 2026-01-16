"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface StickyImageScrollProps {
  imageUrl: string;
  title: string;
  description: string;
  className?: string;
}

export default function StickyImageScroll({
  imageUrl,
  title,
  description,
  className = "",
}: StickyImageScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentBoxRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(800);

  // Update viewport height
  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight);
    };
    updateViewportHeight();
    window.addEventListener("resize", updateViewportHeight);
    return () => window.removeEventListener("resize", updateViewportHeight);
  }, []);

  // Calculate and set container height based on content
  useEffect(() => {
    const updateHeight = () => {
      if (!contentBoxRef.current) return;
      const contentHeight = contentBoxRef.current.offsetHeight;
      const totalHeight = viewportHeight * 1.5 + contentHeight;
      setContainerHeight(totalHeight);
    };

    // Delay to ensure content is rendered
    const timer = setTimeout(updateHeight, 150);
    window.addEventListener("resize", updateHeight);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateHeight);
    };
  }, [viewportHeight, title, description]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Content position: moves from bottom to middle of screen
  const contentY = useTransform(
    scrollYProgress,
    [0, 0.4, 1],
    [viewportHeight - (contentBoxRef?.current?.offsetHeight || 340), 0, 0],
  );

  // Content opacity: fades in
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6],
    [0, 1, 1],
  );

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight || "350vh" }}
      className={`relative ${className}`}
    >
      {/* Sticky Image Background */}
      <motion.div className="sticky top-0 z-0 h-screen w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover brightness-100"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent" />
      </motion.div>

      {/* Content Box - Scrolls over sticky image */}
      <motion.div
        ref={contentBoxRef}
        style={{
          y: contentY,
          opacity: contentOpacity,
        }}
        className="content-box absolute inset-x-0 z-10 mr-auto w-full max-w-4xl px-4"
      >
        <div className="rounded-lg p-8 md:p-12">
          <h2 className="font-heading text-3xl font-bold text-gray-100 md:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-200 md:text-xl">
            {description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
