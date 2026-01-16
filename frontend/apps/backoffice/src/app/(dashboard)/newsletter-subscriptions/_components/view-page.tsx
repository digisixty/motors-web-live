"use client";

import { useGetNewsletterSubscription } from "@workspace/api";
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
  Mail,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function NewsletterSubscriptionDetailPage({ id }: { id: string }) {
  const subscriptionId = parseInt(id);

  const {
    data: subscription,
    isLoading,
    error,
  } = useGetNewsletterSubscription(!isNaN(subscriptionId) ? subscriptionId : 0, {
    query: {
      enabled: !isNaN(subscriptionId),
    },
  });

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading newsletter subscription: {error.message}
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

  if (isNaN(subscriptionId)) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Invalid subscription ID
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Newsletter subscription not found</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="mb-6">
        <Link href="/newsletter-subscriptions">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Newsletter Subscriptions
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {subscription.email || "Unknown Email"}
            </h1>
            <p className="text-muted-foreground">
              View and manage this newsletter subscription
            </p>
          </div>
          <Badge
            variant={subscription.isActive ? "default" : "secondary"}
            className="flex items-center gap-1"
          >
            {subscription.isActive ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Active
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                Inactive
              </>
            )}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Subscription Information
            </CardTitle>
            <CardDescription>Details about the subscriber</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </h4>
              <p className="text-sm">{subscription.email || "-"}</p>
            </div>

            <div>
              <h4 className="font-semibold text-sm">Status</h4>
              <div className="mt-1">
                <Badge
                  variant={subscription.isActive ? "default" : "secondary"}
                  className="flex items-center gap-1 w-fit"
                >
                  {subscription.isActive ? (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3" />
                      Inactive
                    </>
                  )}
                </Badge>
              </div>
            </div>

            {subscription.created && (
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Subscribed Date
                </h4>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(subscription.created), "PPP p")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timestamp Information
            </CardTitle>
            <CardDescription>Important dates for this subscription</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscription.created && (
              <div>
                <h4 className="font-semibold text-sm">Created At</h4>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(subscription.created), "PPP p")}
                </p>
              </div>
            )}

            {subscription.lastModified && (
              <div>
                <h4 className="font-semibold text-sm">Last Modified</h4>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(subscription.lastModified), "PPP p")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
