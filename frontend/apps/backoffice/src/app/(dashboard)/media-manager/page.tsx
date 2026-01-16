"use client";

import { MediaManagerContent } from "@/components/media-manager/media-manager-content";

export default function MediaManagerPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Media Manager</h2>
        <p className="text-muted-foreground">
          Manage your media library and upload new images
        </p>
      </div>

      <MediaManagerContent
        onSelect={undefined}
        multiple={false}
        maxSelections={1}
        showActions={false}
        imagesGridClassName="max-h-max"
      />
    </div>
  );
}
