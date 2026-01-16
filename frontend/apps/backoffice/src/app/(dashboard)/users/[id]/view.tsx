"use client";

import Link from "next/link";
import { useGetUserById } from "@workspace/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Mail, Shield, Check, X, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ViewUserPageProps {
  id: string;
}

export default function ViewUserPage({ id }: ViewUserPageProps) {
  const userId = id;

  const {
    data: user,
    isLoading,
    error,
  } = useGetUserById(userId, {
    query: {
      enabled: !!userId,
    },
  });

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading user: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="mb-6">
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">User not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-6">
        <Link
          href="/users"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Details
            </CardTitle>
            <Link href={`/users/${user.id}/edit`}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </Button>
            </Link>
          </div>
          <CardDescription>View user information and roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl font-medium">
                  {user.userName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">{user.userName}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  User ID
                </label>
                <p className="font-mono text-sm">{user.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email Status
                </label>
                <div className="flex items-center gap-2">
                  {user.emailConfirmed ? (
                    <>
                      <Check className="h-3 w-3 text-green-600" />
                      <Badge
                        variant="secondary"
                        className="text-green-700 bg-green-100"
                      >
                        Verified
                      </Badge>
                    </>
                  ) : (
                    <>
                      <X className="h-3 w-3 text-red-600" />
                      <Badge
                        variant="secondary"
                        className="text-red-700 bg-red-100"
                      >
                        Not Verified
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Roles */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Roles
              </label>
              <div className="flex flex-wrap gap-2">
                {user.roles && user.roles.length > 0 ? (
                  user.roles.map((role, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs flex items-center gap-1"
                    >
                      <Shield className="h-2 w-2" />
                      {role}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    No roles assigned
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t">
              <Link href={`/users/${user.id}/edit`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit User
                </Button>
              </Link>
              <Link href="/users">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Users
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
