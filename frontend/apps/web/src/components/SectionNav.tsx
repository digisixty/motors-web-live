"use client";
import { useStickyTop } from "@/hooks/useStickyTop";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SectionNav({
  sections,
}: {
  sections: { id: string; label: string }[];
}) {
  const [active, setActive] = useState(sections?.[0]?.id);
  const navRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const isSticky = useStickyTop(navRef);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Check for overflow and update arrow visibility
  const checkOverflow = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const hasOverflow = container.scrollWidth > container.clientWidth;
    setShowLeftArrow(hasOverflow && container.scrollLeft > 0);
    setShowRightArrow(
      hasOverflow &&
        container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  // Scroll functions
  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollBy({ left: -200, behavior: "smooth" });
    setTimeout(checkOverflow, 300);
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollBy({ left: 200, behavior: "smooth" });
    setTimeout(checkOverflow, 300);
  };

  useEffect(() => {
    const navHeight = navRef.current?.offsetHeight || 0;
    const observers: IntersectionObserver[] = [];
    let ticking = false;

    // Check overflow on mount and resize
    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    // Use IntersectionObserver with precise top detection
    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (
            entry?.isIntersecting &&
            entry.intersectionRect.top <= navHeight + 1
          ) {
            setActive(section.id);
          }
        },
        {
          rootMargin: `-${navHeight}px 0px -${100 - (navHeight / window.innerHeight) * 100}% 0px`,
          threshold: [0, 0.1, 0.5, 1],
        },
      );

      observer.observe(el);
      observers.push(observer);
    });

    // Add scroll event listener for even more precision
    const handleScroll = () => {
      if (ticking) return;

      requestAnimationFrame(() => {
        const scrollPosition = window.scrollY + navHeight + 1;

        // Find the section that's currently at the top
        for (const section of sections) {
          const el = document.getElementById(section.id);
          if (!el) continue;

          const rect = el.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;

          if (
            elementTop <= scrollPosition &&
            elementTop + el.offsetHeight > scrollPosition
          ) {
            setActive(section.id);
            break;
          }
        }

        ticking = false;
      });

      ticking = true;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", checkOverflow);
      observers.forEach((obs) => obs.disconnect());
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sections]);

  return (
    <nav
      ref={navRef}
      className={cn(
        "sticky top-0 z-40 bg-white",
        isSticky ? "border-b shadow-sm" : "border-b-0 shadow-none",
      )}
    >
      <div className="relative flex items-center justify-center px-4 md:px-8">
        {/* Left arrow - only on mobile when needed */}
        <button
          onClick={scrollLeft}
          className={cn(
            "absolute left-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-black shadow-md transition-opacity md:hidden",
            !showLeftArrow && "pointer-events-none opacity-0",
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Scrollable container */}
        <ul
          ref={scrollContainerRef}
          onScroll={checkOverflow}
          className="flex items-center justify-center gap-6 overflow-x-auto px-10 py-4 pb-2 text-sm scrollbar-hide md:px-8"
        >
          {sections.map((s) => (
            <li key={s.id} className="shrink-0">
              <button
                onClick={() => {
                  const element = document.getElementById(s.id);
                  if (!element) return;

                  const navHeight = navRef.current?.offsetHeight || 0;
                  const elementTop =
                    element.getBoundingClientRect().top + window.pageYOffset;
                  const offsetPosition = elementTop - navHeight - 1;

                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                  });

                  // Set active immediately for better UX
                  setTimeout(() => {
                    setActive(s.id);
                  }, 700);
                }}
                className={`cursor-pointer border-b-2 pb-2 whitespace-nowrap ${active === s.id ? "border-black text-black" : "border-transparent text-gray-600"} `}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Right arrow - only on mobile when needed */}
        <button
          onClick={scrollRight}
          className={cn(
            "absolute right-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-black shadow-md transition-opacity md:hidden",
            !showRightArrow && "pointer-events-none opacity-0",
          )}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
