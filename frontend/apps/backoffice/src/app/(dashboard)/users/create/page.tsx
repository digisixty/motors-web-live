"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateUser, type CreateUserResponse } from "@workspace/api";
import UserForm, { UserFormData } from "../_components/user-form";

export default function CreateUserPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createUserMutation = useCreateUser({
    mutation: {
      onSuccess: (data: CreateUserResponse) => {
        if (data.success) {
          toast.success("User created successfully");
          // Invalidate the users list query to refetch the updated data
          queryClient.invalidateQueries({
            queryKey: ['/api/Admin/V1/Users']
          });
          router.push("/users");
        } else {
          toast.error(data.errors?.join(", ") || "Failed to create user");
        }
      },
      onError: (error: any) => {
        // Handle validation errors from the API
        if (error.response?.data?.errors) {
          let errorMessage: string;
          const errors = error.response.data.errors;

          if (Array.isArray(errors)) {
            errorMessage = errors.join(", ");
          } else if (typeof errors === 'object' && errors !== null) {
            // Handle object with arrays of error messages
            const errorMessages = Object.values(errors).flatMap(errorArray =>
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
          toast.error("An error occurred while creating the user");
        }
      },
    },
  });

  const handleSubmit = async (values: UserFormData) => {
    createUserMutation.mutate({
      data: {
        userName: values.userName,
        password: values.password,
        role: values.role === "none" ? null : values.role,
      },
    });
  };

  const handleCancel = () => {
    router.push("/users");
  };

  return (
    <UserForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={createUserMutation.isPending}
      submitButtonText="Create User"
      submitButtonLoadingText="Creating User..."
      title="Create New User"
      description="Create a new user account. Users without roles are considered public users with no backoffice access."
      backButtonText="Back to Users"
      backUrl="/users"
    />
  );
}