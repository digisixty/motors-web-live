"use client";

import { motion, useAnimation, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface FullScreenLoaderProps {
  onComplete?: () => void;
}

const minimumDisplayTime = 1000; // Minimum display time in milliseconds

export default function FullScreenLoader({
  onComplete,
}: FullScreenLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const controls = useAnimation();
  const logoControls = useAnimation();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;

    const startTime = Date.now();

    // Disable body scroll when loader is active
    document.body.style.overflow = "hidden";

    // Check if everything is loaded
    const checkLoaded = () => {
      if (document.readyState === "complete") {
        const elapsedTime = Date.now() - startTime;

        // If site loaded in less than minimumDisplayTime seconds, wait until minimumDisplayTime seconds total
        // If site took longer than minimumDisplayTime seconds, close immediately
        const remainingTime = Math.max(0, minimumDisplayTime - elapsedTime);

        setTimeout(() => {
          setIsLoading(false);
        }, remainingTime);
      } else {
        // Check again after 100ms
        setTimeout(checkLoaded, 100);
      }
    };

    checkLoaded();

    // Fallback: if loading takes too long, show content after 5 seconds
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
      clearTimeout(fallbackTimer);
      // Re-enable body scroll when loader unmounts
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;

    // Start logo animation when component mounts - fade in and hold
    logoControls.start({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        delay: 0.2,
      },
    });
  }, [logoControls]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;

    if (!isLoading) {
      // Fade out both logo and loader together
      Promise.all([
        logoControls.start({
          opacity: 0,
          scale: 0.8,
          transition: {
            duration: 0.5,
            ease: "easeInOut",
          },
        }),
        controls.start({
          opacity: 0,
          transition: {
            duration: 0.5,
            ease: "easeInOut",
          },
        }),
      ]).then(() => {
        setShowContent(true);
        onComplete?.();
      });
    }
  }, [isLoading, controls, logoControls, onComplete]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;

    // Re-enable body scroll when content is shown
    if (showContent) {
      document.body.style.overflow = "";
    }
  }, [showContent]);

  if (showContent) return null;
  if (process.env.NODE_ENV === "development") return null;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 1 }}
      animate={controls}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={logoControls}
        className="relative"
      >
        {/* Sample logo - replace with your actual logo */}
        <div className="flex items-center justify-center">
          <img
            src="/logo-only-white.png"
            alt="Logo"
            className="h-24 w-24 object-contain"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
