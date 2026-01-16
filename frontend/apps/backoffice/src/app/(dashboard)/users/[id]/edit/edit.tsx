"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useGetUserById, useUpdateUser, useGetProfile } from "@workspace/api";
import UserForm, { UserFormData } from "../../_components/user-form";

interface EditUserPageProps {
  id: string;
}

export default function EditUserPage({ id }: EditUserPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
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

  const { data: currentUser } = useGetProfile({
    query: {
      enabled: true,
    },
  });

  // Check if the user is editing themselves
  const isEditingSelf = currentUser?.id === userId;

  const updateUserMutation = useUpdateUser({
    mutation: {
      onSuccess: (data) => {
        if (data.success) {
          toast.success("User updated successfully");
          // Invalidate the users list query to refetch the updated data
          queryClient.invalidateQueries({
            queryKey: ["/api/Admin/V1/Users"],
          });
          // Invalidate the specific user query
          queryClient.invalidateQueries({
            queryKey: [`/api/Admin/V1/Users/${userId}`],
          });
          router.push("/users");
        } else {
          toast.error(data.errors?.join(", ") || "Failed to update user");
        }
      },
      onError: (error: any) => {
        // Handle validation errors from the API
        if (error.response?.data?.errors) {
          let errorMessage: string;
          const errors = error.response.data.errors;

          if (Array.isArray(errors)) {
            errorMessage = errors.join(", ");
          } else if (typeof errors === "object" && errors !== null) {
            // Handle object with arrays of error messages
            const errorMessages = Object.values(errors).flatMap((errorArray) =>
              Array.isArray(errorArray) ? errorArray : [String(errorArray)]
            );
            errorMessage = errorMessages.join(", ");
          } else {
            errorMessage = String(errors);
          }

          toast.error(errorMessage);
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else if (error.message) {
          toast.error(error.message);
        } else {
          toast.error("An error occurred while updating the user");
        }
      },
    },
  });

  const handleSubmit = async (values: UserFormData) => {
    if (!user) return;

    // Check if role was changed
    const currentRole = user.roles?.includes("Administrator")
      ? "Administrator"
      : "none";
    const newRole = values.role || "none";
    const roleChanged = currentRole !== newRole;

    // Check if email was changed
    const emailChanged = values.userName !== user.userName;

    // Prevent role changes when editing self
    if (isEditingSelf && roleChanged) {
      toast.error("You cannot change your own role");
      return;
    }

    // If nothing changed, show message and return
    if (!roleChanged && !emailChanged) {
      toast.info("No changes to save");
      return;
    }

    updateUserMutation.mutate({
      id: userId,
      data: {
        email: values.userName,
        emailConfirmed: user.emailConfirmed, // Preserve current email confirmed status
        role: newRole === "none" ? null : newRole,
      },
    });
  };

  const handleCancel = () => {
    router.push("/users");
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">
          Error loading user: {error.message}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
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

  // Transform user data to form format
  const defaultValues: Partial<UserFormData> = {
    userName: user.userName || "",
    role: user.roles?.includes("Administrator") ? "Administrator" : "none",
  };

  return (
    <UserForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={updateUserMutation.isPending}
      submitButtonText="Update User"
      submitButtonLoadingText="Updating User..."
      title="Edit User"
      description="Update user information. Leave the password field blank to keep the current password unchanged."
      backButtonText="Back to Users"
      backUrl="/users"
      defaultValues={defaultValues}
      isEdit={true}
      isEditingSelf={isEditingSelf}
    />
  );
}
