"use client";

import { useInView, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  delay?: number;
  once?: boolean;
}

export function CountUp({
  from = 0,
  to,
  duration = 2,
  className = "",
  decimals = 0,
  prefix = "",
  suffix = "",
  separator = ",",
  delay = 0,
  once = true,
}: CountUpProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(from.toString());

  const motionValue = useMotionValue(from);
  const spring = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      const rounded = latest.toFixed(decimals);
      const parts = rounded.split(".");
      parts[0] = parts?.[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, separator) || "";
      setDisplayValue(parts.join(decimals > 0 ? "." : ""));
    });

    return () => unsubscribe();
  }, [spring, decimals, separator]);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(to);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView, motionValue, to, delay]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

export default CountUp;
