"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { CDN_BASE_URL } from "@/constants/urls";
import DateRenderer from "@/lib/dateRenderer";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import NewsSlider from "@/components/containers/newsSlider/newsSlider";
import { useGetBlogBySlug, useGetBlogs } from "@workspace/api";
import { Empty } from "@/components/ui/empty";

function NewsDetails() {
  const params = useParams();
  const slug = params?.slug as string;

  // Fetch blog post by slug
  const {
    data: blogData,
    isLoading: blogLoading,
    error: blogError,
  } = useGetBlogBySlug(slug);

  // Fetch blog posts for news slider
  const { data: blogsData, isLoading: blogsLoading } = useGetBlogs({
    pageSize: 12,
    sortBy: "created",
    sortDirection: "desc",
  });

  // Transform blog data for the news slider
  const transformedNewsSlides =
    blogsData?.items?.map((blog) => ({
      img: blog.coverImageAbsoluteUrl || blog.coverImage || "",
      title: blog.title || "Untitled",
      shortDesc: blog.shortDescription || "",
      date: blog.created || new Date().toISOString(),
      slug: blog.slug || "",
    })) || [];

  if (blogLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:max-w-2xl xl:max-w-3xl xl:py-20">
        <Skeleton className="mb-4 h-8 w-1/2 rounded-sm bg-neutral-300 text-2xl lg:max-w-3/4" />
        <div className="h-52 overflow-hidden md:h-80 xl:h-96">
          <Skeleton className="h-full w-full rounded-2xl bg-neutral-300" />
        </div>

        <div className="py-4">
          <Skeleton className="mb-4 h-4 w-40 rounded-sm bg-neutral-300 text-2xl lg:max-w-3/4" />
        </div>
        <div className="">
          <Skeleton className="mb-2 h-2 w-full rounded-sm bg-neutral-300 text-2xl lg:max-w-3/4" />
          <Skeleton className="mb-2 h-2 w-full rounded-sm bg-neutral-300 text-2xl lg:max-w-3/4" />
          <Skeleton className="mb-2 h-2 w-full rounded-sm bg-neutral-300 text-2xl lg:max-w-3/4" />
        </div>
      </div>
    );
  }

  if (blogError || !blogData) {
    return (
      <div className="container mx-auto px-4 py-8 md:max-w-2xl xl:max-w-3xl xl:py-20">
        <Empty title="News article not found" />
      </div>
    );
  }

  // Transform blog data to match the expected format
  const newsDetail = {
    img:
      blogData.coverImageAbsoluteUrl ||
      blogData.coverImage ||
      `${CDN_BASE_URL}/cdn/static/samples/HLD_MY23_0015_V002_desktop.avif`,
    title: blogData.title || "Untitled",
    shortDesc: blogData.shortDescription || "",
    date: blogData.created || new Date().toISOString(),
    slug: blogData.slug || "",
    fullTxt: blogData.fullDescription || "",
  };

  return (
    <div className="container mx-auto px-4 py-8 md:max-w-2xl xl:max-w-3xl xl:py-20">
      <h1 className="mb-4 text-2xl lg:max-w-3/4">{newsDetail?.title}</h1>

      <div className="relative h-52 overflow-hidden rounded-2xl md:h-80 xl:h-96">
        <Image
          src={newsDetail?.img}
          alt={newsDetail?.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
        />
      </div>

      <div className="py-4">
        <DateRenderer date={newsDetail?.date} />
      </div>

      <div dangerouslySetInnerHTML={{ __html: newsDetail?.shortDesc }} />

      <div
        className="mt-4"
        dangerouslySetInnerHTML={{ __html: newsDetail?.fullTxt }}
      />

      <div className="container mx-auto px-4 py-20">
        <div className="font-heading text-xl font-bold lg:text-3xl xl:text-2xl">
          Global Car news
        </div>
        {blogsLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <NewsSlider
            slides={transformedNewsSlides}
            imgClassName="lg:h-32 xl:h-50"
          />
        )}
      </div>
    </div>
  );
}

export default NewsDetails;
