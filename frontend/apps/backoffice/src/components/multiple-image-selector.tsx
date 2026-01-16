"use client";

import Image from "next/image";
import { useMemo, memo, useCallback, useState, useEffect, useRef } from "react";
import { Trash2, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useImagePicker } from "@/hooks/use-image-picker";
import { VideoThumbnail } from "@/components/video-thumbnail";

interface MultipleImageSelectorProps {
  value?: string[]; // Array of image URLs (relative for submission)
  absoluteValues?: string[]; // Array of absolute URLs for display
  onChange: (urls: string[]) => void;
  label?: string;
  description?: string;
  maxImages?: number;
  disabled?: boolean;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  imageAltPrefix?: string;
  className?: string;
}

interface ImageWithUrl {
  url: string;
  absoluteUrl: string;
  id?: string;
  index: number; // Use index as stable key
}

// Map to track relative URLs to their absolute URLs
interface AbsoluteUrlMap {
  [key: string]: string;
}

// Function to check if URL is a video file
const isVideoUrl = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.wmv', '.flv', '.m4v', '.mkv'];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

// Memoized Image Card component
const ImageCard = memo(({ image, imageAltPrefix, onReplace, onRemove, disabled }: {
  image: ImageWithUrl;
  imageAltPrefix: string;
  onReplace: () => void;
  onRemove: () => void;
  disabled: boolean;
}) => {
  const isVideo = useMemo(() => image.absoluteUrl ? isVideoUrl(image.absoluteUrl) : false, [image.absoluteUrl]);

  return (
    <Card className="overflow-hidden group p-0">
      <div className="aspect-square relative">
        {isVideo ? (
          <VideoThumbnail
            videoUrl={image.absoluteUrl}
            width={320}
            height={320}
            showPlayButton={true}
            fill={true}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            alt={`${imageAltPrefix} ${image.index + 1}`}
          />
        ) : (
          <Image
            src={image.absoluteUrl}
            alt={`${imageAltPrefix} ${image.index + 1}`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
              onClick={onReplace}
              disabled={disabled}
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={onRemove}
              disabled={disabled}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Media type badge */}
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
          {image.index + 1}
        </div>

        {/* Video badge */}
        {isVideo && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-0.5 rounded text-xs font-medium">
            Video
          </div>
        )}
      </div>
    </Card>
  );
});

ImageCard.displayName = "ImageCard";

export function MultipleImageSelector({
  value = [],
  absoluteValues,
  onChange,
  maxImages = 10,
  disabled = false,
  imageAltPrefix = "Image",
  className = "",
}: MultipleImageSelectorProps) {
  const { openImagePicker } = useImagePicker();

  // Internal state to track absolute URLs for newly selected images
  const [internalAbsoluteUrls, setInternalAbsoluteUrls] = useState<AbsoluteUrlMap>({});
  const justModifiedRef = useRef(false);

  // Sync internal state when absoluteValues prop changes (for pre-loaded data)
  useEffect(() => {
    // Don't override if we just added/replaced an image (internal state is correct)
    if (justModifiedRef.current) {
      justModifiedRef.current = false;
      return;
    }

    // Sync with props when absoluteValues are provided
    if (absoluteValues && absoluteValues.length > 0) {
      const newMap: AbsoluteUrlMap = {};
      absoluteValues.forEach((absUrl, index) => {
        if (value[index]) {
          newMap[value[index]] = absUrl;
        }
      });
      setInternalAbsoluteUrls(newMap);
    }
  }, [value, absoluteValues]);

  // Use useMemo to prevent unnecessary re-renders and stable keys
  const images = useMemo<ImageWithUrl[]>(() =>
    value.map((url, index) => ({
      url,
      absoluteUrl: internalAbsoluteUrls[url] || absoluteValues?.[index] || url,
      id: url,
      index, // Use index as stable key
    })),
    [value, absoluteValues, internalAbsoluteUrls]
  );

  const handleAddImage = useCallback(async () => {
    if (images.length >= maxImages) {
      return;
    }

    try {
      const selectedImages = await openImagePicker({
        multiple: true,
        maxSelections: maxImages - images.length,
      });

      const newImages = Array.isArray(selectedImages)
        ? selectedImages
        : [selectedImages];
      const newUrls = newImages.map((img) => img.relativeUrl);

      // Store absolute URLs for preview
      const newAbsoluteUrls: AbsoluteUrlMap = {};
      newImages.forEach((img) => {
        newAbsoluteUrls[img.relativeUrl] = img.absoluteUrl;
      });
      justModifiedRef.current = true;
      setInternalAbsoluteUrls(prev => ({ ...prev, ...newAbsoluteUrls }));

      onChange([...value, ...newUrls]);
    } catch (error) {
      // User cancelled selection
    }
  }, [images.length, maxImages, openImagePicker, value, onChange]);

  const handleRemoveImage = useCallback((index: number) => {
    justModifiedRef.current = true;
    const updatedUrls = value.filter((_, i) => i !== index);
    onChange(updatedUrls);
  }, [value, onChange]);

  const handleReplaceImage = useCallback(async (index: number) => {
    try {
      const selectedImage = await openImagePicker({
        multiple: false,
        maxSelections: 1,
      });

      if (selectedImage) {
        const updatedUrls = [...value];
        updatedUrls[index] = selectedImage.relativeUrl;

        // Store absolute URL for preview
        justModifiedRef.current = true;
        setInternalAbsoluteUrls(prev => ({
          ...prev,
          [selectedImage.relativeUrl]: selectedImage.absoluteUrl
        }));

        onChange(updatedUrls);
      }
    } catch (error) {
      // User cancelled selection
    }
  }, [value, openImagePicker, onChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          {maxImages > 0 && (
            <p className="text-xs text-gray-400">
              {images.length} / {maxImages} media
            </p>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddImage}
          disabled={disabled || images.length >= maxImages}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Media
        </Button>
      </div>

      {images.length === 0 ? (
        <></>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((image) => (
            <ImageCard
              key={image.url}
              image={image}
              imageAltPrefix={imageAltPrefix}
              onReplace={() => handleReplaceImage(image.index)}
              onRemove={() => handleRemoveImage(image.index)}
              disabled={disabled}
            />
          ))}

          {/* Add more images button */}
          {images.length < maxImages && (
            <Card
              className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors cursor-pointer overflow-hidden"
              onClick={handleAddImage}
            >
              <CardContent className="flex flex-col items-center justify-center h-full">
                <Plus className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Add More</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
