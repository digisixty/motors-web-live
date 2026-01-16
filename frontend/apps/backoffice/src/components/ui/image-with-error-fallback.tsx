/* eslint-disable @next/next/no-img-element */
"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface ImageWithErrorFallbackProps extends Omit<
  ImageProps,
  "onError" | "src"
> {
  fallback?: React.ReactNode;
  fallbackClassName?: string;
  src?: string;
}

export default function ImageWithErrorFallback({
  fallback,
  fallbackClassName = "w-full h-full bg-gray-100 flex items-center justify-center",
  alt,
  src,
  ...props
}: ImageWithErrorFallbackProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={fallbackClassName}>
        {fallback || <span className="text-gray-400 text-xs">No image</span>}
      </div>
    );
  }

  return <img alt={alt} src={src} onError={() => setError(true)} {...props} />;
}
