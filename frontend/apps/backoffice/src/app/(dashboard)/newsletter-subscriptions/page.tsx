"use client";

import { useState } from "react";
import {
  useGetNewsletterSubscriptionsList,
  useDeleteNewsletterSubscription,
} from "@workspace/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import PaginationBox from "@/components/ui/pagination-box";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Eye,
  Trash,
  Search,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function NewsletterSubscriptionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;

  const {
    data: subscriptionsData,
    isLoading,
    error,
    refetch,
  } = useGetNewsletterSubscriptionsList({
    pageNumber: currentPage,
    pageSize: pageSize,
    search: searchTerm || undefined,
  });

  const deleteSubscriptionMutation = useDeleteNewsletterSubscription({
    mutation: {
      onSuccess: () => {
        toast.success("Newsletter subscription deleted successfully");
        refetch();
      },
      onError: (error) => {
        toast.error("Failed to delete subscription: " + error.message);
      },
    },
  });

  const handleDelete = async (id: number) => {
    if (
      window.confirm("Are you sure you want to delete this newsletter subscription?")
    ) {
      deleteSubscriptionMutation.mutate({ id });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading newsletter subscriptions: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Newsletter Subscriptions
          </h1>
          <p className="text-muted-foreground">
            Manage newsletter subscribers and subscriptions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Subscribers
          </CardTitle>
          <CardDescription>
            A list of all newsletter subscribers and their subscription status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </div>
          </form>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: pageSize }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-full" />
              ))}
            </div>
          ) : subscriptionsData?.items && subscriptionsData.items.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptionsData.items.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span>{subscription.email || "Unknown"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {subscription.created ? (
                            <span>
                              {format(
                                new Date(subscription.created),
                                "MMM dd, yyyy"
                              )}
                            </span>
                          ) : (
                            "-"
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/newsletter-subscriptions/${subscription.id}`}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(subscription.id!)}
                              disabled={deleteSubscriptionMutation.isPending}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {subscriptionsData &&
                subscriptionsData.totalPages &&
                subscriptionsData.totalPages > 1 && (
                  <div className="mt-4">
                    <PaginationBox
                      currentPage={currentPage}
                      totalPages={subscriptionsData.totalPages}
                      hasPreviousPage={subscriptionsData.hasPreviousPage}
                      hasNextPage={subscriptionsData.hasNextPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Mail className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No newsletter subscriptions found
              </h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                {searchTerm
                  ? "No subscriptions match your search criteria."
                  : "No newsletter subscriptions have been received yet."}
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Clear search
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
