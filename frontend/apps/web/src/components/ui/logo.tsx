import { cn } from "@/lib/utils";
import React from "react";

function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("font-heading", className)}>MATTHEOS IOANNOU MOTORS</div>
  );
}

export default Logo;
