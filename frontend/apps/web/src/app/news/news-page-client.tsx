"use client";

import { PublicBlogListDto, useGetBlogs } from "@workspace/api";
import { useNewsQueryParams } from "@/hooks/useNewsQueryParams";
import NewsCard from "./_components/news-card";
import PaginationBox from "@/components/ui/pagination-box";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FileText, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CDN_BASE_URL } from "@/constants/urls";
import { NewsSlider } from "@/components/newsSlider";

function NewsPageContent() {
  const { page, getApiParams, hasActiveFilters, resetAllFilters } =
    useNewsQueryParams();

  const { data, isLoading, error, refetch } = useGetBlogs(getApiParams());

  // Transform API data to match NewsCard component props
  const transformNewsData = (blog: PublicBlogListDto) => {
    return {
      title: blog.title || "",
      img:
        blog.coverImageAbsoluteUrl ||
        `${CDN_BASE_URL}/cdn/static/samples/HLD_MY23_0015_V002_desktop.avif`,
      slug: blog.slug || "",
      date: blog.created || new Date().toISOString(),
      shortDesc: blog.shortDescription || "",
    };
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 gap-y-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="h-64 w-full animate-pulse rounded-md bg-gray-200" />
        <div className="h-64 w-full animate-pulse rounded-md bg-gray-200" />
        <div className="h-64 w-full animate-pulse rounded-md bg-gray-200" />
        <div className="h-64 w-full animate-pulse rounded-md bg-gray-200" />
        <div className="h-64 w-full animate-pulse rounded-md bg-gray-200" />
        <div className="h-64 w-full animate-pulse rounded-md bg-gray-200" />
        <div className="h-64 w-full animate-pulse rounded-md bg-gray-200" />
        <div className="h-64 w-full animate-pulse rounded-md bg-gray-200" />
      </div>
    );
  }

  if (error) {
    return (
      <Empty className="min-h-[400px]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileText className="size-6" />
          </EmptyMedia>
          <EmptyTitle>Error loading news</EmptyTitle>
        </EmptyHeader>
        <EmptyContent>
          <EmptyDescription>
            Problem fetching news articles from the server.
          </EmptyDescription>
          <Button onClick={() => refetch()} variant="outline" className="mt-2">
            <RotateCcw className="mr-2 size-4" />
            Retry
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  const news = data?.items?.map(transformNewsData) || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  // Get featured news for slider (first 6 articles)
  const featuredNews = news.slice(0, 6).map((item) => ({
    id: item.slug,
    title: item.title,
    date: item.date,
    shortDescription: item.shortDesc,
    featuredImageUrl: item.img,
    slug: item.slug,
  }));

  // Show empty state when no news found
  if (!isLoading && !error && news.length === 0) {
    return (
      <Empty className="min-h-[400px]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileText className="size-6" />
          </EmptyMedia>
          <EmptyTitle>No news articles found</EmptyTitle>
        </EmptyHeader>
        <EmptyContent>
          <EmptyDescription>
            {hasActiveFilters
              ? "We couldn't find any news articles matching your search. Try adjusting your search terms or reset filters to see all available news."
              : "There are no news articles available at the moment. Please check back later."}
          </EmptyDescription>
          {hasActiveFilters && (
            <Button
              onClick={resetAllFilters}
              variant="outline"
              className="mt-2"
            >
              <RotateCcw className="mr-2 size-4" />
              Reset Filters
            </Button>
          )}
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div>
      {/* Show NewsSlider only on page 1 */}
      {page === 1 && featuredNews.length > 0 && (
        <div className="mb-8">
          <NewsSlider slides={featuredNews} />
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-600">
          {totalCount} {totalCount === 1 ? "Article" : "Articles"}
        </h2>
      </div>

      <div className="grid gap-4 gap-y-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {news?.map((item, index) => (
          <NewsCard key={`${item.slug}-${index}`} {...item} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <PaginationBox
            currentPage={page}
            totalPages={totalPages}
            hasPreviousPage={data?.hasPreviousPage}
            hasNextPage={data?.hasNextPage}
          />
        </div>
      )}
    </div>
  );
}

function NewsPageClient() {
  return <NewsPageContent />;
}

export default NewsPageClient;
