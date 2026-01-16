"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeItemId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeItemId, onChange, className }: TabsProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile (you can adjust this breakpoint as needed)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className={cn("w-full", className)}>
        <select
          value={activeItemId}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-screen overflow-x-auto overflow-y-hidden border-b border-gray-200",
        className,
      )}
    >
      <nav className="-mb-px flex items-center justify-center space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "shrink-0 border-b-2 px-1 py-2 text-sm font-medium transition-colors",
              activeItemId === tab.id
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
