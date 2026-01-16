"use client";

import Image from "next/image";
import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { Image as ImageIcon, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useImagePicker } from "@/hooks/use-image-picker";
import { VideoThumbnail } from "@/components/video-thumbnail";

interface SingleImageSelectorProps {
  value?: string; // Single image URL (relative for submission)
  absoluteValue?: string; // Absolute URL for display
  onChange: (url?: string) => void;
  disabled?: boolean;
  className?: string;
}

// Function to check if URL is a video file
const isVideoUrl = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.wmv', '.flv', '.m4v', '.mkv'];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

export function SingleImageSelector({
  value,
  absoluteValue,
  onChange,
  disabled = false,
  className,
}: SingleImageSelectorProps) {
  const { openImagePicker } = useImagePicker();
  const [internalAbsoluteUrl, setInternalAbsoluteUrl] = useState<string | undefined>(absoluteValue);
  const justSelectedRef = useRef(false);

  // Update internal absolute URL when absoluteValue prop changes (for pre-loaded data)
  useEffect(() => {
    // Don't override if we just selected an image (internal state is correct)
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }

    // Sync with prop when it's provided
    if (absoluteValue) {
      setInternalAbsoluteUrl(absoluteValue);
    } else if (value === undefined) {
      // Clear internal state when value is cleared
      setInternalAbsoluteUrl(undefined);
    }
  }, [value, absoluteValue]);

  // Derive state from props to avoid sync issues
  const selectedImage = useMemo(() => {
    if (!value) return null;
    return {
      url: value,
      absoluteUrl: internalAbsoluteUrl || absoluteValue || value,
    };
  }, [value, absoluteValue, internalAbsoluteUrl]);

  const isVideo = useMemo(() =>
    selectedImage?.absoluteUrl ? isVideoUrl(selectedImage.absoluteUrl) : false,
    [selectedImage?.absoluteUrl]
  );

  const handleSelectImage = useCallback(async () => {
    try {
      const image = await openImagePicker({
        multiple: false,
        maxSelections: 1,
      });

      if (image) {
        // Store absolute URL for preview, but send relative URL for form submission
        justSelectedRef.current = true;
        setInternalAbsoluteUrl(image.absoluteUrl);
        onChange(image.relativeUrl);
      }
    } catch (error) {
      // User cancelled selection
    }
  }, [openImagePicker, onChange]);

  const handleRemoveImage = useCallback(() => {
    justSelectedRef.current = true;
    setInternalAbsoluteUrl(undefined);
    onChange(undefined);
  }, [onChange]);

  const handleReplaceImage = useCallback(async () => {
    try {
      const image = await openImagePicker({
        multiple: false,
        maxSelections: 1,
      });

      if (image) {
        // Store absolute URL for preview, but send relative URL for form submission
        justSelectedRef.current = true;
        setInternalAbsoluteUrl(image.absoluteUrl);
        onChange(image.relativeUrl);
      }
    } catch (error) {
      // User cancelled selection
    }
  }, [openImagePicker, onChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      {!selectedImage ? (
        <Card
          className="transition-colors cursor-pointer p-3 w-fit"
          onClick={handleSelectImage}
        >
          <CardContent className="flex flex-row items-center justify-start gap-2 p-0">
            <ImageIcon className="h-16 w-16 text-gray-400" />
            <div className="flex gap-1 flex-col">
              <p className="text-lg font-medium text-gray-600 ">
                No media selected
              </p>
              <p className="text-sm text-gray-500 text-center">
                Click to select an image or video from your media library
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="overflow-hidden group w-60 py-0 gap-0">
            <div className="relative aspect-video">
              {isVideo ? (
                <VideoThumbnail
                  videoUrl={selectedImage.absoluteUrl}
                  width={640}
                  height={360}
                  className="w-full h-full"
                />
              ) : (
                <Image
                  src={selectedImage.absoluteUrl}
                  alt="Selected media"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 240px"
                  onError={(e) => {
                    e.currentTarget.src = "/admin/no-car-placeholder.webp" as unknown as string;
                  }}
                />
              )}

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-80">
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={handleReplaceImage}
                    disabled={disabled}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Replace
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={handleRemoveImage}
                    disabled={disabled}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>

              {/* Media type badge */}
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-medium">
                {isVideo ? "Video" : "Image"}
              </div>
            </div>

            {/* Image info */}
            {/* {selectedImage.originalFileName && (
              <div className="p-2 bg-gray-50">
                <p
                  className="text-sm text-gray-600 truncate"
                  title={selectedImage.originalFileName}
                >
                  {selectedImage.originalFileName}
                </p>
              </div>
            )} */}
          </Card>

          {/* Action buttons for non-hover interactions */}
          {/* <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReplaceImage}
              disabled={disabled}
            >
              <Edit className="h-4 w-4 mr-2" />
              Change Image
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveImage}
              disabled={disabled}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Image
            </Button>
          </div> */}
        </div>
      )}
    </div>
  );
}
