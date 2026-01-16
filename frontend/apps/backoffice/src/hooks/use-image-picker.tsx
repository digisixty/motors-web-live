"use client";

import React, { useCallback } from "react";
import { useDialog } from "@/contexts/dialog-context";
import { ImageGalleryDialog } from "@/components/image-gallery-dialog";

interface ImagePickerOptions {
  multiple?: boolean;
  maxSelections?: number;
}

interface ImagePickerResult {
  openImagePicker: (options?: ImagePickerOptions) => Promise<any>;
  openImagePickerDialog: (
    onSelect: (image: any) => void,
    options?: ImagePickerOptions
  ) => void;
}

export function useImagePicker(): ImagePickerResult {
  const { openDialog, closeDialog } = useDialog();

  const openImagePicker = useCallback(
    (options: ImagePickerOptions = {}): Promise<any> => {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Dialog timeout"));
          closeDialog();
        }, 30000); // 30 second timeout

        const handleSelect = (result: any) => {
          clearTimeout(timeout);
          closeDialog();
          resolve(result);
        };

        openDialog({
          title: options.multiple ? "Select Images" : "Select Image",
          body: (
            <ImageGalleryDialog
              onSelect={handleSelect}
              multiple={options.multiple}
              maxSelections={options.maxSelections}
            />
          ),
          closable: true,
        });
      });
    },
    [openDialog, closeDialog]
  );

  const openImagePickerDialog = useCallback(
    (onSelect: (image: any) => void, options: ImagePickerOptions = {}) => {
      openDialog({
        title: options.multiple ? "Select Images" : "Select Image",
        body: (
          <ImageGalleryDialog
            onSelect={onSelect}
            multiple={options.multiple}
            maxSelections={options.maxSelections}
          />
        ),
        closable: true,
      });
    },
    [openDialog]
  );

  return {
    openImagePicker,
    openImagePickerDialog,
  };
}
