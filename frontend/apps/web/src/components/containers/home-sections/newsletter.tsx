"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCreateNewsletterSubscription } from "@workspace/api";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { CDN_BASE_URL } from "@/constants/urls";

// Form validation schema
const newsletterFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address")
    .max(255, "Email must be less than 255 characters"),
});

type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;

function Newsletter() {
  const { executeRecaptcha: recaptchaExecute } = useGoogleReCaptcha();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      email: "",
    },
  });

  // Mutation for submitting newsletter subscription
  const { mutate, isPending } = useCreateNewsletterSubscription({
    mutation: {
      onSuccess: () => {
        toast.success("Thank you for subscribing to our newsletter!");
        reset();
      },
      onError: (error: Error) => {
        toast.error(error?.message || "Failed to subscribe. Please try again.");
      },
    },
  });

  const onSubmit = async (data: NewsletterFormValues) => {
    try {
      // Execute reCAPTCHA automatically
      if (!recaptchaExecute) {
        toast.error("reCAPTCHA is not available");
        return;
      }

      const token = await recaptchaExecute("newsletter_subscription");

      mutate({
        data: {
          email: data.email,
          recaptchaToken: token,
        },
      });
    } catch (error) {
      toast.error("reCAPTCHA validation failed");
      console.error("reCAPTCHA error:", error);
    }
  };

  return (
    <section className="relative px-4 py-10 md:p-10 md:px-0">
      <div className="container mx-auto flex w-full flex-col items-center overflow-hidden rounded-xl bg-black md:rounded-lg lg:flex-row lg:pb-0">
        <div className="relative h-60 w-full md:h-[450px] md:max-w-3xl">
          <Image
            src={`${CDN_BASE_URL}/cdn/2026/01/photo-1434030216411-0b793f4b4173_20260105192343_4295fb8f.jpeg`}
            alt="Newsletter"
            fill
            className="object-cover shadow-2xl"
          />
        </div>

        {/* Right Content */}
        <div className="flex-1 space-y-6 px-4 py-8 text-center lg:order-2 lg:px-8 lg:py-0 lg:text-left xl:px-12 2xl:px-20">
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold tracking-wider text-white uppercase md:text-3xl lg:text-4xl">
              Newsletter
            </h2>
            <p className="text-base text-neutral-300 md:text-lg">
              Subscribe to our newsletter for exclusive offers and the latest
              automotive news
            </p>
          </div>

          {/* Subscription Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="mx-auto lg:mx-0">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Mail className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-neutral-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                    className={`h-12 border-white/20 bg-white/10 pl-10 text-white placeholder:text-neutral-400 focus:border-white/40 focus-visible:ring-white/20 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isPending}
                  className="h-12 bg-white px-8 text-neutral-900 hover:bg-neutral-100"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;
