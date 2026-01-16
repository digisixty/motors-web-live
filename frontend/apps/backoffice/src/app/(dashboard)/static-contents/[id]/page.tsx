"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetStaticContentById } from "@workspace/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Edit,
  FileText,
  Calendar,
  User,
} from "lucide-react";
import Link from "next/link";
import ImageWithErrorFallback from "@/components/ui/image-with-error-fallback";
import { formatDistanceToNow } from "date-fns";

function StaticContentDetailPageContent() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const { data: staticContentData, isLoading, error } = useGetStaticContentById(id);

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading static content: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!staticContentData) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              Static content not found
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/static-contents">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Static Contents
          </Button>
        </Link>
        <Link href={`/static-contents/${id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Static Content
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-2xl">{staticContentData.title}</CardTitle>
              <CardDescription>Slug: {staticContentData.slug}</CardDescription>
            </div>
            {staticContentData.mainImageAbsoluteUrl && (
              <div className="w-32 h-32 relative rounded-lg overflow-hidden shrink-0 ml-4">
                <ImageWithErrorFallback
                  src={staticContentData.mainImageAbsoluteUrl!}
                  alt={staticContentData.title || "Static content"}
                  fill
                  className="object-cover"
                  fallback={
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                  }
                />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Description
            </h3>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{staticContentData.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <span>Created</span>
              </div>
              <p className="text-sm font-medium">
                {staticContentData.created
                  ? formatDistanceToNow(new Date(staticContentData.created), {
                      addSuffix: true,
                    })
                  : "N/A"}
              </p>
              {staticContentData.createdBy && (
                <p className="text-xs text-muted-foreground">
                  by {staticContentData.createdBy}
                </p>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <User className="h-4 w-4" />
                <span>Last Modified</span>
              </div>
              <p className="text-sm font-medium">
                {staticContentData.lastModified
                  ? formatDistanceToNow(
                      new Date(staticContentData.lastModified),
                      { addSuffix: true }
                    )
                  : "N/A"}
              </p>
              {staticContentData.lastModifiedBy && (
                <p className="text-xs text-muted-foreground">
                  by {staticContentData.lastModifiedBy}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function StaticContentDetailPage() {
  return <StaticContentDetailPageContent />;
}
