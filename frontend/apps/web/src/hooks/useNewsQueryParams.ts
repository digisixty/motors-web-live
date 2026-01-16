"use client";

import { useQueryState } from "nuqs";
import { useEffect } from "react";

interface NewsQueryParams {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortDirection?: string;
}

export function useNewsQueryParams() {
  const [page, setPage] = useQueryState("page", {
    defaultValue: 1,
    serialize: (value: number) => value.toString(),
    parse: (value: string) => parseInt(value, 10) || 1,
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
    defaultValue: 9, // Changed to 9 to match the grid layout (3x3)
    serialize: (value: number) => value.toString(),
    parse: (value: string) => parseInt(value, 10) || 9,
  });

  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    serialize: (value: string) => value,
    parse: (value: string) => value || "",
  });

  const [sortBy, setSortBy] = useQueryState("sortBy", {
    defaultValue: "created",
    serialize: (value: string) => value,
    parse: (value: string) => value || "created",
  });

  const [sortDirection, setSortDirection] = useQueryState("sortDirection", {
    defaultValue: "desc",
    serialize: (value: string) => value,
    parse: (value: string) => value || "desc",
  });

  // Get API-ready parameters
  const getApiParams = (): any => {
    return {
      pageNumber: page,
      pageSize: pageSize,
      ...(search && { search }),
      ...(sortBy && { sortBy }),
      ...(sortDirection && { sortDirection }),
    };
  };

  // Reset all filters (including page)
  const resetAllFilters = () => {
    setPage(1);
    setSearch("");
    setSortBy("created");
    setSortDirection("desc");
  };

  return {
    // Individual state setters
    page,
    setPage,
    pageSize,
    setPageSize,
    search,
    setSearch,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,

    // Utility functions
    getApiParams,
    resetAllFilters,

    // Current state
    hasActiveFilters: !!search || sortBy !== "created" || sortDirection !== "desc",
  };
}

export type { NewsQueryParams };