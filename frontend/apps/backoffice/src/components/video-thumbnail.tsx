"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

interface VideoThumbnailProps {
  videoUrl: string;
  width?: number;
  height?: number;
  quality?: number;
  className?: string;
  alt?: string;
  showPlayButton?: boolean;
  fill?: boolean;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

const DB_NAME = 'video-thumbnails';
const STORE_NAME = 'thumbnails';
const DB_VERSION = 1;

interface ThumbnailCache {
  url: string;
  dataUrl: string;
  timestamp: number;
}

// Initialize IndexedDB
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'url' });
      }
    };
  });
};

// Get cached thumbnail
const getCachedThumbnail = async (videoUrl: string): Promise<string | null> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(videoUrl);

      request.onsuccess = () => {
        const cached = request.result as ThumbnailCache | undefined;
        // Cache expires after 30 days
        if (cached && Date.now() - cached.timestamp < 30 * 24 * 60 * 60 * 1000) {
          resolve(cached.dataUrl);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    return null;
  }
};

// Cache thumbnail
const cacheThumbnail = async (videoUrl: string, dataUrl: string): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const cache: ThumbnailCache = {
        url: videoUrl,
        dataUrl,
        timestamp: Date.now(),
      };

      const request = store.put(cache);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    // Silently fail - thumbnail will be generated next time
  }
};

// Extract first frame from video
const extractThumbnail = async (
  videoUrl: string,
  width: number,
  height: number,
  quality: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.crossOrigin = 'anonymous';
    video.muted = true;

    video.onloadedmetadata = () => {
      video.currentTime = 0;
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(video, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        cacheThumbnail(videoUrl, dataUrl);
        video.remove();

        resolve(dataUrl);
      } catch (error) {
        video.remove();
        reject(error);
      }
    };

    video.onerror = () => {
      video.remove();
      reject(new Error('Failed to load video'));
    };

    const timeout = setTimeout(() => {
      video.remove();
      reject(new Error('Video loading timeout'));
    }, 10000);

    video.onloadeddata = () => clearTimeout(timeout);
    video.src = videoUrl;
  });
};

/**
 * VideoThumbnail component - generates and displays video thumbnails
 *
 * Features:
 * - Extracts first frame from video
 * - Caches in IndexedDB (30-day expiration)
 * - Only loads metadata, not full video
 * - Loading and error states
 * - Optional play button overlay
 */
export function VideoThumbnail({
  videoUrl,
  width = 320,
  height = 180,
  quality = 0.8,
  className = '',
  alt = 'Video thumbnail',
  showPlayButton = false,
  fill = false,
  sizes,
  objectFit = 'cover',
}: VideoThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    if (!videoUrl) return;

    setIsLoading(true);
    setError(false);

    // Check cache first
    getCachedThumbnail(videoUrl)
      .then((cached) => {
        if (cached) {
          if (isMounted.current) {
            setThumbnail(cached);
            setIsLoading(false);
          }
          return;
        }

        // Generate thumbnail
        return extractThumbnail(videoUrl, width, height, quality);
      })
      .then((dataUrl) => {
        if (dataUrl && isMounted.current) {
          setThumbnail(dataUrl);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted.current) {
          setError(true);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted.current = false;
    };
  }, [videoUrl, width, height, quality]);

  // Loading state
  if (isLoading) {
    return (
      <div className={`w-full h-full bg-gray-200 animate-pulse flex items-center justify-center ${className}`}>
        <Play className="h-8 w-8 text-gray-400" />
      </div>
    );
  }

  // Error state
  if (error || !thumbnail) {
    return (
      <div className={`w-full h-full bg-gray-100 flex items-center justify-center ${className}`}>
        <Play className="h-8 w-8 text-gray-400" />
      </div>
    );
  }

  // Success state
  if (fill) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={thumbnail}
          alt={alt}
          fill
          className={`object-${objectFit}`}
          sizes={sizes}
        />
        {showPlayButton && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <Play className="h-5 w-5 text-gray-800 ml-0.5" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Image
        src={thumbnail}
        alt={alt}
        width={width}
        height={height}
        className={`object-${objectFit}`}
      />
      {showPlayButton && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <Play className="h-5 w-5 text-gray-800 ml-0.5" />
          </div>
        </div>
      )}
    </div>
  );
}

// Utility function to clear all cached thumbnails
export const clearThumbnailCache = async (): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    // Silently fail
  }
};
