"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useCreateContactSubmission } from "@workspace/api";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

// Form validation schema
const contactFormSchema = z.object({
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
    .min(3, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
  service: z.enum(["Overall", "Offer", "Test Drive Appointment"], {
    message: "Please select a service",
  }),
  projectCategory: z.string().optional(),
  budget: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

// const projectCategories = ["Web Design", "Mobile App", "Branding", "SEO"];
// const budgets = ["< $5K", "$5K - $10K", "$10K - $25K", "> $25K"];

interface ContactFormProps {
  onSubmitSuccess?: () => void;
}

export function ContactForm({ onSubmitSuccess }: ContactFormProps) {
  const { executeRecaptcha: recaptchaExecute } = useGoogleReCaptcha();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      message: "",
      service: "Overall",
    },
  });

  // Mutation for submitting contact form
  const { mutate, isPending } = useCreateContactSubmission({
    mutation: {
      onSuccess: () => {
        toast.success("Contact form submitted successfully!");
        reset();
        onSubmitSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to submit contact form");
      },
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      // Execute reCAPTCHA automatically
      if (!recaptchaExecute) {
        toast.error("reCAPTCHA is not available");
        return;
      }

      const token = await recaptchaExecute("contact_form");

      mutate({
        data: {
          fullName: data.fullName,
          email: data.email,
          message: data.message,
          type: data.service === "Test Drive Appointment" ? 1 : 0,
          extraDetails: JSON.stringify({
            service: data.service,
          }),
          recaptchaToken: token,
        },
      });
    } catch (error: any) {
      toast.error("reCAPTCHA validation failed");
      console.error("reCAPTCHA error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Service Selection Radios */}
      <div className="mb-6 flex flex-wrap gap-4">
        {["Overall", "Test Drive Appointment"].map((service) => (
          <label
            key={service}
            className="flex cursor-pointer items-center space-x-2"
          >
            <input
              type="radio"
              value={service}
              {...register("service")}
              className="h-4 w-4 appearance-none rounded-full border border-neutral-400 checked:border-neutral-400 checked:bg-white focus:ring-1 focus:ring-white focus:outline-none"
            />
            <span className="text-sm">{service}</span>
          </label>
        ))}
      </div>

      {/* Name and Email */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Input
            placeholder="Full name"
            {...register("fullName")}
            className={errors.fullName ? "border-red-500" : ""}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.fullName.message}
            </p>
          )}
        </div>
        <div>
          <Input
            type="email"
            placeholder="Email"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Category and Budget Dropdowns */}
      {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <select
            {...register("projectCategory")}
            className="w-full rounded-lg border border-neutral-400 bg-transparent p-2 text-white ring-0 outline-none"
          >
            <option value="">Project category</option>
            {projectCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            {...register("budget")}
            className="w-full rounded-lg border border-neutral-400 bg-transparent p-2 text-white ring-0 outline-none"
          >
            <option value="">Budget</option>
            {budgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div> */}

      {/* Message */}
      <div>
        <textarea
          placeholder="Message"
          rows={8}
          {...register("message")}
          className={`w-full resize-none rounded-lg border border-neutral-400 bg-transparent p-2 text-white ring-0 outline-none ${
            errors.message ? "border-red-500" : ""
          }`}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full text-black"
        variant="outline"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send message"
        )}
      </Button>
    </form>
  );
}
