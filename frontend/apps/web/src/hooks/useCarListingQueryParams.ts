"use client";

import { useQueryState } from "nuqs";
import { useEffect } from "react";

interface CarListingQueryParams {
  page: number;
  pageSize: number;
  [key: `attribute[${string}]`]: string | undefined;
}

interface CarListingQueryState {
  page: number;
  pageSize: number;
  attributes: Record<string, string>;
}

export function useCarListingQueryParams() {
  const [page, setPage] = useQueryState("page", {
    defaultValue: 1,
    serialize: (value: number) => value.toString(),
    parse: (value: string) => parseInt(value, 10) || 1,
  });

  const [isSold, setIsSold] = useQueryState("isSold", {
    defaultValue: false,
    serialize: (value: boolean) => value.toString(),
    parse: (value: string) => value === "true",
  });

  const [isSpecialOffer, setIsSpecialOffer] = useQueryState("isSpecialOffer", {
    defaultValue: false,
    serialize: (value: boolean) => value.toString(),
    parse: (value: string) => value === "true",
  });

  // Sync page state when URL changes (e.g., when pagination is used)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const urlPage = urlParams.get("page");
        const newPage = urlPage ? parseInt(urlPage, 10) : 1;
        if (newPage !== page) {
          setPage(newPage);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [page, setPage]);

  const [pageSize, setPageSize] = useQueryState("pageSize", {
    defaultValue: 12,
    serialize: (value: number) => value.toString(),
    parse: (value: string) => parseInt(value, 10) || 12,
  });

  // Helper to get all attribute filters from URL
  const getAttributeFilters = (): Record<string, string> => {
    const filters: Record<string, string> = {};
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.forEach((value, key) => {
        if (key.startsWith("attribute[")) {
          filters[key] = value;
        }
      });
    }
    return filters;
  };

  // Helper to set an attribute filter using direct URL manipulation
  const setAttributeFilter = (attributeKey: string, value: string | null) => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const key = `attribute[${attributeKey}]`;

    if (value && value.trim()) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }

    // Reset to page 1 when any filter changes
    url.searchParams.set("page", "1");

    window.history.pushState({}, "", url.toString());
    // Trigger a re-render by dispatching a popstate event
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  // Helper to clear all attribute filters
  const clearAttributeFilters = () => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const keysToDelete: string[] = [];

    url.searchParams.forEach((_, key) => {
      if (key.startsWith("attribute[")) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => url.searchParams.delete(key));

    // Reset page to 1 when clearing filters
    url.searchParams.set("page", "1");

    window.history.pushState({}, "", url.toString());
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  // Helper to set multiple attributes at once
  const setMultipleAttributes = (attributes: Record<string, string | null>) => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);

    Object.entries(attributes).forEach(([key, value]) => {
      const paramKey = `attribute[${key}]`;
      if (value && value.trim()) {
        url.searchParams.set(paramKey, value);
      } else {
        url.searchParams.delete(paramKey);
      }
    });

    // Reset to page 1 when any filter changes
    url.searchParams.set("page", "1");

    window.history.pushState({}, "", url.toString());
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  // Get API-ready parameters
  const getApiParams = (): any => {
    const attributeFilters = getAttributeFilters();
    return {
      pageNumber: page,
      pageSize: pageSize,
      isSold: isSold,
      isSpecialOffer: isSpecialOffer,
      ...attributeFilters,
    };
  };

  // Reset all filters (including page)
  const resetAllFilters = () => {
    setPage(1);
    setIsSold(false);
    setIsSpecialOffer(false);
    clearAttributeFilters();
  };

  return {
    // Individual state setters
    page,
    setPage,
    pageSize,
    setPageSize,

    // Boolean filters
    isSold,
    setIsSold,
    isSpecialOffer,
    setIsSpecialOffer,

    // Attribute filters
    getAttributeFilters,
    setAttributeFilter,
    clearAttributeFilters,
    setMultipleAttributes,

    // Utility functions
    getApiParams,
    resetAllFilters,

    // Current state
    hasActiveFilters: Object.keys(getAttributeFilters()).length > 0 || isSold || isSpecialOffer,
  };
}

export type { CarListingQueryParams, CarListingQueryState };
