"use client";

import React, { useState, useCallback, useRef, useMemo, memo } from "react";
import Image from "next/image";
import {
  Upload,
  Search,
  Image as ImageIcon,
  Loader2,
  Check,
  Trash2,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { VideoThumbnail } from "@/components/video-thumbnail";

import {
  useGetApiAdminV1Images as useGetImages,
  usePostApiAdminV1Images as useUploadImage,
  useDeleteApiAdminV1Images as useDeleteImage,
} from "@workspace/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import PaginationBox from "@/components/ui/pagination-box";

interface MediaManagerContentProps {
  onSelect?: (image: any) => void;
  multiple?: boolean;
  maxSelections?: number;
  showActions?: boolean;
  imagesGridClassName?: string;
}

export function MediaManagerContent({
  onSelect,
  multiple = false,
  maxSelections = 1,
  showActions = true,
  imagesGridClassName,
}: MediaManagerContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("media-library");
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch images
  const {
    data: imagesData,
    isLoading,
    refetch,
  } = useGetImages(
    {
      pageNumber: currentPage,
      pageSize: 24,
      searchTerm: searchTerm || null,
    },
    {
      query: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
      },
    }
  );

  // Upload image mutation
  const uploadImageMutation = useUploadImage({
    mutation: {
      onSuccess: () => {
        toast.success("Image uploaded successfully");
        setUploadProgress(0);
        setIsUploading(false);
        setCurrentPage(1);
        refetch();
        setActiveTab("media-library");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to upload image");
        setUploadProgress(0);
        setIsUploading(false);
      },
    },
  });

  const [deletedImageId, setDeletedImageId] = useState<number | null>(null);
  const [copiedImageId, setCopiedImageId] = useState<number | null>(null);

  // Delete image mutation
  const deleteImageMutation = useDeleteImage({
    mutation: {
      onSuccess: () => {
        toast.success("Image deleted successfully");
        refetch();
        // Remove from selected images if it was selected
        if (deletedImageId !== null) {
          setSelectedImages((prev) =>
            prev.filter((img) => img.id !== deletedImageId)
          );
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete image");
      },
    },
  });

  const handleImageSelect = useCallback(
    (image: any) => {
      if (!onSelect) return; // Only handle selection if onSelect is provided

      if (multiple) {
        setSelectedImages((prev) => {
          const isSelected = prev.some((img) => img.id === image.id);
          if (isSelected) {
            return prev.filter((img) => img.id !== image.id);
          }
          if (prev.length >= maxSelections) {
            toast.error(`You can only select up to ${maxSelections} images`);
            return prev;
          }
          return [...prev, image];
        });
      } else {
        setSelectedImages([image]);
      }
    },
    [multiple, maxSelections, onSelect]
  );

  const handleDeleteImage = useCallback(
    async (imageId: number, e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent selecting the image when clicking delete

      if (!window.confirm("Are you sure you want to delete this image?")) {
        return;
      }

      setDeletedImageId(imageId);
      try {
        await deleteImageMutation.mutateAsync({ id: imageId });
      } finally {
        setDeletedImageId(null);
      }
    },
    [deleteImageMutation]
  );

  const handleCopyUrl = useCallback(
    async (relativeUrl: string, imageId: number, e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent selecting the image when clicking copy

      try {
        await navigator.clipboard.writeText(relativeUrl);
        setCopiedImageId(imageId);
        toast.success("URL copied to clipboard");

        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopiedImageId(null);
        }, 2000);
      } catch (error) {
        toast.error("Failed to copy URL");
      }
    },
    []
  );

  const handleConfirmSelection = () => {
    if (!onSelect) return; // Only handle selection if onSelect is provided

    if (selectedImages.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    if (multiple) {
      onSelect(selectedImages);
    } else {
      onSelect(selectedImages[0]);
    }
  };

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Handle search term change with debounce
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
  }, []);

  // Function to check if a file is an image or video
  const isValidMediaFile = useCallback((file: File): boolean => {
    const isValidType =
      file.type.startsWith("image/") || file.type.startsWith("video/");
    const isValidSize = file.size <= 100 * 1024 * 1024; // 100MB limit
    return isValidType && isValidSize;
  }, []);

  const handleFileUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const validFiles = Array.from(files).filter(isValidMediaFile);

      if (validFiles.length === 0) {
        toast.error("Please select valid image or video files (max 100MB each)");
        return;
      }

      for (const file of validFiles) {
        setIsUploading(true);
        setUploadProgress(0);

        // Simulate progress (in real implementation, you'd track actual upload progress)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        try {
          await uploadImageMutation.mutateAsync({
            data: { file },
          });
        } finally {
          clearInterval(progressInterval);
        }
      }
    },
    [uploadImageMutation, isValidMediaFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileUpload(e.dataTransfer.files);
    },
    [handleFileUpload]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileUpload(e.target.files);
    },
    [handleFileUpload]
  );

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Function to check if URL is a video file
  const isVideoUrl = (url: string): boolean => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  // Memoized Media Card component to prevent unnecessary re-renders
  const MediaCard = memo(({ image, isSelected, onSelect, onDelete, onCopyUrl, isDeleting, isCopied }: {
    image: any;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: (e: React.MouseEvent) => void;
    onCopyUrl: (e: React.MouseEvent) => void;
    isDeleting: boolean;
    isCopied: boolean;
  }) => {
    const isVideo = useMemo(() => image.absoluteUrl ? isVideoUrl(image.absoluteUrl) : false, [image.absoluteUrl]);

    return (
      <Card
        className={cn(
          "cursor-pointer transition-all py-0 hover:shadow-md relative overflow-hidden group",
          isSelected && "ring-2 ring-primary"
        )}
        onClick={onSelect}
      >
        <CardContent className="p-0">
          <div className="aspect-square relative">
            {isVideo ? (
              <VideoThumbnail
                videoUrl={image.absoluteUrl}
                width={240}
                height={240}
                showPlayButton={true}
                fill={true}
                alt={image.altText || image.originalFileName}
              />
            ) : (
              <Image
                src={image.absoluteUrl || ""}
                alt={image.altText || image.originalFileName}
                fill
                sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                className="object-cover"
                loading="lazy"
              />
            )}

            {/* Video badge */}
            {isVideo && (
              <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-0.5 rounded text-xs font-medium">
                Video
              </div>
            )}

            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full p-1 z-10">
                <Check className="h-3 w-3" />
              </div>
            )}

            {/* Delete button */}
            <button
              onClick={onDelete}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-90 transition-opacity hover:bg-red-600 disabled:opacity-50 z-10"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
            </button>

            {/* Image info overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex flex-col justify-end p-2 opacity-0 group-hover:opacity-90">
              <p className="text-white text-xs truncate mb-1">
                {image.originalFileName}
              </p>
              {image.fileSizeInBytes && (
                <p className="text-white text-xs opacity-75 mb-2">
                  {formatFileSize(image.fileSizeInBytes)}
                </p>
              )}
              {image.relativeUrl && (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={image.relativeUrl}
                    readOnly
                    className="flex-1 bg-white/20 text-white text-xs px-2 py-1 rounded border border-white/30 truncate"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={onCopyUrl}
                    className="bg-white/20 hover:bg-white/30 text-white p-1 rounded transition-colors shrink-0"
                    title="Copy URL"
                  >
                    {isCopied ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }, (prevProps, nextProps) => {
    // Custom comparison for memo - only re-render if these props change
    return (
      prevProps.image.id === nextProps.image.id &&
      prevProps.image.absoluteUrl === nextProps.image.absoluteUrl &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.isDeleting === nextProps.isDeleting &&
      prevProps.isCopied === nextProps.isCopied
    );
  });

  MediaCard.displayName = "MediaCard";

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full flex-1"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="media-library">Media Library</TabsTrigger>
        <TabsTrigger value="upload">Upload New Media</TabsTrigger>
      </TabsList>

      <TabsContent value="media-library" className="mt-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Gallery */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                All Media{" "}
                {imagesData?.totalCount && `(${imagesData.totalCount})`}
              </h3>
              {onSelect && multiple && (
                <Badge variant="secondary">
                  {selectedImages.length}/{maxSelections} selected
                </Badge>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : imagesData?.items && imagesData.items.length > 0 ? (
              <div
                className={cn(
                  "grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-h-[40vh] overflow-y-auto p-1",
                  imagesGridClassName
                )}
              >
                {imagesData.items.map((image) => (
                  <MediaCard
                    key={image.id}
                    image={image}
                    isSelected={onSelect ? selectedImages.some((img) => img.id === image.id) : false}
                    onSelect={() => onSelect && handleImageSelect(image)}
                    onDelete={(e) => handleDeleteImage(Number(image.id), e)}
                    onCopyUrl={(e) => handleCopyUrl(image.relativeUrl!, Number(image.id), e)}
                    isDeleting={deleteImageMutation.isPending && deletedImageId === Number(image.id)}
                    isCopied={copiedImageId === Number(image.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">No media found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Switch to the Upload tab to add new media
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {imagesData && imagesData.totalPages && imagesData.totalPages > 1 && (
            <PaginationBox
              currentPage={imagesData.pageNumber || 1}
              totalPages={imagesData.totalPages}
              hasPreviousPage={imagesData.hasPreviousPage || false}
              hasNextPage={imagesData.hasNextPage || false}
              onPageChange={handlePageChange}
            />
          )}

          {/* Actions */}
          {showActions && onSelect && (
            <div className="flex justify-end space-x-2 pt-4 border-t shrink-0">
              <Button
                onClick={handleConfirmSelection}
                disabled={selectedImages.length === 0}
              >
                {multiple
                  ? `Select ${selectedImages.length} Item${selectedImages.length !== 1 ? "s" : ""}`
                  : "Select"}
              </Button>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="upload" className="mt-6">
        <div className="space-y-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-gray-400"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleInputChange}
              className="hidden"
              disabled={isUploading}
            />

            <div className="space-y-2">
              <Upload className="h-12 w-12 mx-auto text-gray-400" />
              <div className="text-sm text-gray-600">
                <p>Drag and drop images or videos here, or click to select</p>
                <p className="text-xs mt-1">Maximum file size: 100MB</p>
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  triggerFileInput();
                }}
                disabled={isUploading}
                size="sm"
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
            </div>

            {isUploading && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm">Uploading...</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}
          </div>

          {imagesData?.items && imagesData.items.length > 0 && (
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                {imagesData.totalCount} media files in your library
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Switch to the Media Library tab to browse and select existing
                media
              </p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
