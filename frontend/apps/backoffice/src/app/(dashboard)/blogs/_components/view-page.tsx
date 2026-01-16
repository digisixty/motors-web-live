"use client";

import { useGetBlog } from "@workspace/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  ArrowLeft,
  Edit,
  FileText,
  Image as ImageIcon,
  Video,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function BlogDetailPage({ id }: { id: string }) {
  const blogId = parseInt(id);

  const {
    data: blog,
    isLoading,
    error,
  } = useGetBlog(blogId, {
    query: {
      enabled: !isNaN(blogId),
    },
  });

  if (isNaN(blogId)) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">Invalid blog ID</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading blog: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="mb-6">
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-8 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Blog not found</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="mb-6">
        <Link href="/blogs">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{blog.title}</h1>
            <p className="text-muted-foreground">
              View and manage this blog post
            </p>
          </div>
          <Link href={`/blogs/${blog.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Blog
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Main details about the blog post</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm">Title</h4>
              <p className="text-sm">{blog.title}</p>
            </div>

            <div>
              <h4 className="font-semibold text-sm">Slug</h4>
              <Badge variant="secondary">{blog.slug}</Badge>
            </div>

            {blog.shortDescription && (
              <div>
                <h4 className="font-semibold text-sm">Short Description</h4>
                <p className="text-sm text-muted-foreground">
                  {blog.shortDescription}
                </p>
              </div>
            )}

            {blog.coverImageAbsoluteUrl && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Cover Image</h4>
                <div className="rounded-md overflow-hidden border">
                  <img
                    src={blog.coverImageAbsoluteUrl.trim()}
                    alt="Cover image"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement!.innerHTML = `
                        <div class="w-full h-48 flex items-center justify-center text-xs text-muted-foreground text-center p-2">
                          Failed to load cover image
                        </div>
                      `;
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 break-all">
                  {blog.coverImageAbsoluteUrl}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline & SEO
            </CardTitle>
            <CardDescription>
              Publication dates and SEO metadata
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm">Created</h4>
              <p className="text-sm text-muted-foreground">
                {blog.created ? format(new Date(blog.created), "PPP p") : "-"}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sm">Last Modified</h4>
              <p className="text-sm text-muted-foreground">
                {blog.lastModified
                  ? format(new Date(blog.lastModified), "PPP p")
                  : "-"}
              </p>
            </div>

            {/* {blog.metaTags && (
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Meta Tags
                </h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {blog.metaTags.split(",").map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {blog.metaTags}
                </p>
              </div>
            )} */}
          </CardContent>
        </Card>
      </div>

      {blog.fullDescription && (
        <Card>
          <CardHeader>
            <CardTitle>Full Content</CardTitle>
            <CardDescription>Complete blog post content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                {blog.fullDescription}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {blog.imagesGalleryAbsoluteUrls &&
        blog.imagesGalleryAbsoluteUrls.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Images Gallery
              </CardTitle>
              <CardDescription>
                Additional images for this blog post
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {blog.imagesGalleryAbsoluteUrls.map((image, index) => (
                  <div
                    key={index}
                    className="rounded-md overflow-hidden border"
                  >
                    <img
                      src={image.trim()}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement!.innerHTML = `
                        <div class="w-full h-32 flex items-center justify-center text-xs text-muted-foreground text-center p-2">
                          Failed to load image
                        </div>
                      `;
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {blog.videosGalleryAbsoluteUrls &&
        blog.videosGalleryAbsoluteUrls.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Videos Gallery
              </CardTitle>
              <CardDescription>
                Videos associated with this blog post
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blog.videosGalleryAbsoluteUrls.map((video, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <p className="text-sm font-medium mb-2">
                      Video {index + 1}
                    </p>
                    <video
                      controls
                      className="w-full h-48 object-cover rounded"
                      preload="metadata"
                    >
                      <source src={video.trim()} type="video/mp4" />
                      <source src={video.trim()} type="video/webm" />
                      Your browser does not support the video tag.
                    </video>
                    <p className="text-xs text-muted-foreground break-all mt-2">
                      {video}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
