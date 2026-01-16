"use client";

import { MediaManagerContent } from "@/components/media-manager/media-manager-content";

interface ImageGalleryDialogProps {
  onSelect: (image: any) => void;
  multiple?: boolean;
  maxSelections?: number;
}

export function ImageGalleryDialog({
  onSelect,
  multiple = false,
  maxSelections = 1,
}: ImageGalleryDialogProps) {
  return (
    <MediaManagerContent
      onSelect={onSelect}
      multiple={multiple}
      maxSelections={maxSelections}
      showActions={true}
    />
  );
}
