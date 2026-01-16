"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useLogin } from "@workspace/api";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Form validation schema
const loginFormSchema = z.object({
  userName: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const router = useRouter();
  const { setToken } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  // Mutation for login
  const { mutate, isPending } = useLogin({
    mutation: {
      onSuccess: (data) => {
        if (data.success && data.token) {
          setToken(data.token);
          toast.success("Login successful!");
          router.push("/");
        } else {
          toast.error(data.errors?.join(", ") || "Login failed");
        }
      },
      onError: (error: any) => {
        toast.error(error?.message || "Login failed");
      },
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutate({
      data: {
        userName: data.userName,
        password: data.password,
      },
    });
  };

  return (
    <div className="container mx-auto flex h-full w-full max-w-xl flex-col items-center justify-center gap-10 px-10 py-8">
      <img
        src="/logo-only-white.png"
        alt="Logo"
        className="h-16 w-24 object-contain invert"
      />
      <h1 className="font-sans! text-2xl font-bold">
        Welcome! Login to your account
      </h1>
      <div className="text-center text-sm text-gray-600">
        Please enter your email address and password to login.
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        {/* Email */}
        <div>
          <Label htmlFor="userName" className="mb-1">
            Email
          </Label>
          <Input
            id="userName"
            type="email"
            placeholder="Enter your email"
            {...register("userName")}
            className={errors.userName ? "border-red-500" : ""}
          />
          {errors.userName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.userName.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password" className="mb-1">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password")}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>

        {/* Sign up link */}
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
