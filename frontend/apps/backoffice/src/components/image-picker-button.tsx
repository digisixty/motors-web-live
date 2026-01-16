/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useImagePicker } from "@/hooks/use-image-picker";

interface ImagePickerButtonProps {
  onImageSelect: (image: any) => void;
  multiple?: boolean;
  maxSelections?: number;
  variant?: "button" | "card";
  className?: string;
  children?: React.ReactNode;
  selectedImage?: any;
}

export function ImagePickerButton({
  onImageSelect,
  multiple = false,
  maxSelections = 1,
  variant = "button",
  className,
  children,
  selectedImage,
}: ImagePickerButtonProps) {
  const { openImagePickerDialog } = useImagePicker();

  const handleClick = () => {
    openImagePickerDialog(onImageSelect, { multiple, maxSelections });
  };

  if (variant === "card") {
    return (
      <Card
        className={`cursor-pointer hover:shadow-md transition-shadow ${className}`}
        onClick={handleClick}
      >
        <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
          {selectedImage ? (
            <div className="w-full h-32 relative rounded overflow-hidden">
              <img
                src={selectedImage.absoluteUrl || selectedImage.relativeUrl}
                alt={selectedImage.altText || selectedImage.originalFileName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ) : (
            <>
              <ImageIcon className="h-12 w-12 text-gray-400" />
              <p className="text-sm text-gray-600">
                {multiple ? "Select images" : "Select image"}
              </p>
            </>
          )}
          {children}
        </CardContent>
      </Card>
    );
  }

  return (
    <Button onClick={handleClick} variant="outline" className={className}>
      <ImageIcon className="h-4 w-4 mr-2" />
      {children || (multiple ? "Select Images" : "Select Image")}
    </Button>
  );
}
