"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

interface SearchParamsSuspenseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function SearchParamsSuspense({
  children,
  fallback = (
    <div className="flex items-center justify-center min-h-96">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
}: SearchParamsSuspenseProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}