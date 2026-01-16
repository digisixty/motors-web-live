"use client";

import { useGetContactSubmission } from "@workspace/api";
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
  User,
  Mail,
  MessageSquare,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function ContactSubmissionDetailPage({ id }: { id: string }) {
  const submissionId = parseInt(id);

  const {
    data: submission,
    isLoading,
    error,
  } = useGetContactSubmission(!isNaN(submissionId) ? submissionId : 0, {
    query: {
      enabled: !isNaN(submissionId),
    },
  });

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading contact submission: {error.message}
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
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isNaN(submissionId)) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Invalid submission ID
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Contact submission not found</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="mb-6">
        <Link href="/contact-submissions">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contact Submissions
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {submission.fullName || "Unknown Contact"}
            </h1>
            <p className="text-muted-foreground">
              View and manage this contact submission
            </p>
          </div>
          {/* <Badge
            variant={submission.isProcessed ? "default" : "secondary"}
            className="flex items-center gap-1"
          >
            {submission.isProcessed ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Processed
              </>
            ) : (
              <>
                <Clock className="h-4 w-4" />
                Pending
              </>
            )}
          </Badge> */}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>Details about the sender</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </h4>
              <p className="text-sm">{submission.fullName || "-"}</p>
            </div>

            <div>
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </h4>
              <p className="text-sm">{submission.email || "-"}</p>
            </div>

            {submission.created && (
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Submitted Date
                </h4>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(submission.created), "PPP p")}
                </p>
              </div>
            )}

            {/* {submission.processedAt && (
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Processed Date
                </h4>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(submission.processedAt), "PPP p")}
                </p>
              </div>
            )} */}

            {/* {submission.processedBy && (
              <div>
                <h4 className="font-semibold text-sm">Processed By</h4>
                <p className="text-sm">{submission.processedBy}</p>
              </div>
            )} */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Status Information
            </CardTitle>
            <CardDescription>Current status of the submission</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* <div>
              <h4 className="font-semibold text-sm">Processing Status</h4>
              <div className="mt-1">
                <Badge
                  variant={submission.isProcessed ? "default" : "secondary"}
                  className="flex items-center gap-1 w-fit"
                >
                  {submission.isProcessed ? (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      Processed
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3" />
                      Pending Review
                    </>
                  )}
                </Badge>
              </div>
            </div> */}

            {submission.lastModified && (
              <div>
                <h4 className="font-semibold text-sm">Last Modified</h4>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(submission.lastModified), "PPP p")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Message Content
          </CardTitle>
          <CardDescription>The message sent by the customer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-md p-4">
            <p className="text-sm whitespace-pre-wrap">
              {submission.message || "No message provided"}
            </p>
          </div>
        </CardContent>
      </Card>

      {submission.extraDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Additional Details
            </CardTitle>
            <CardDescription>
              Extra information provided by the sender
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-md p-4">
              <p className="text-sm whitespace-pre-wrap">
                {submission.extraDetails}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
