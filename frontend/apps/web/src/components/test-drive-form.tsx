"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useCreateContactSubmission } from "@workspace/api";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

// Form validation schema
const testDriveFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(200, "Full name must be less than 200 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  message: z
    .string()
    .min(3, "Message must be at least 3 characters")
    .max(2000, "Message must be less than 2000 characters"),
  extraDetails: z
    .string()
    .max(1000, "Additional details must be less than 1000 characters")
    .optional(),
});

type TestDriveFormValues = z.infer<typeof testDriveFormSchema>;

interface TestDriveFormProps {
  carListingId?: number;
  carListingName?: string;
  onSubmitSuccess?: () => void;
}

export function TestDriveForm({
  carListingId,
  carListingName,
  onSubmitSuccess,
}: TestDriveFormProps) {
  const { executeRecaptcha: recaptchaExecute } = useGoogleReCaptcha();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TestDriveFormValues>({
    resolver: zodResolver(testDriveFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      message: carListingName
        ? `I am interested in scheduling a test drive for the ${carListingName}.`
        : "",
      extraDetails: carListingId
        ? `Car Listing ID: ${carListingId}`
        : undefined,
    },
  });

  // Mutation for submitting contact form
  const { mutate, isPending } = useCreateContactSubmission({
    mutation: {
      onSuccess: () => {
        toast.success("Test drive request submitted successfully!");
        reset();
        onSubmitSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to submit test drive request");
      },
    },
  });

  const onSubmit = async (data: TestDriveFormValues) => {
    try {
      // Execute reCAPTCHA automatically
      if (!recaptchaExecute) {
        toast.error("reCAPTCHA is not available");
        return;
      }

      const token = await recaptchaExecute("test_drive_form");

      mutate({
        data: {
          fullName: data.fullName,
          email: data.email,
          message: data.message,
          type: 1, // Hardcoded type 1 for "testDrive"
          extraDetails: data.extraDetails,
          recaptchaToken: token,
        },
      });
    } catch (error: any) {
      toast.error("reCAPTCHA validation failed");
      console.error("reCAPTCHA error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          placeholder="Enter your full name"
          {...register("fullName")}
          className={errors.fullName ? "border-red-500" : ""}
        />
        {errors.fullName && (
          <p className="text-sm text-red-500">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Enter your message"
          {...register("message")}
          className={errors.message ? "border-red-500" : ""}
        />
        {errors.message && (
          <p className="text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      {/* Additional Details (hidden but included in form data) */}
      <input type="hidden" {...register("extraDetails")} />

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full"
        variant="default"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Request Test Drive"
        )}
      </Button>
    </form>
  );
}
