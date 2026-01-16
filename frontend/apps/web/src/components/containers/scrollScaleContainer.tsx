"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface ScrollScaleContainerProps {
  imageUrl: string;
  children: React.ReactNode;
  className?: string;
}

export default function ScrollScaleContainer({
  imageUrl,
  children,
  className = "",
}: ScrollScaleContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [elementTop, setElementTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);

  // Update element position when component mounts or window resizes
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateValues = () => {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setElementTop(rect.top + scrollTop);
      setClientHeight(window.innerHeight);
    };

    updateValues();
    window.addEventListener("resize", updateValues);
    window.addEventListener("scroll", updateValues, { passive: true });
    return () => {
      window.removeEventListener("resize", updateValues);
      window.removeEventListener("scroll", updateValues);
    };
  }, []);

  // Get scroll progress
  const { scrollY } = useScroll();

  // Calculate progress from 0 (when top of element enters viewport)
  // to 1 (when top of element reaches middle of screen)
  const progress = useTransform(
    scrollY,
    [elementTop - clientHeight, elementTop - clientHeight / 3],
    [0, 1],
  );

  // Transform progress to scale from 0.7 to 1
  const scale = useTransform(progress, [0, 1], [0.7, 1]);

  // Direct scale without spring physics for immediate response
  const scaleValue = scale;

  return (
    <motion.div
      ref={containerRef}
      style={{
        scale: scaleValue,
      }}
      className={`relative h-screen w-full overflow-hidden ${className}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt="Background"
          className="h-full w-full object-cover brightness-50"
        />
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-start justify-start p-8">
        <div className="max-w-4xl">{children}</div>
      </div>
    </motion.div>
  );
}
