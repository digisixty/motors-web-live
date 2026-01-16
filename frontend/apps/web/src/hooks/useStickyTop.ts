"use client";

import { useEffect, useState } from "react";

export function useStickyTop(ref: React.RefObject<HTMLElement | null>) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      // Sticky means touching top
      setIsSticky(rect.top <= 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // run once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, [ref]);

  return isSticky;
}
