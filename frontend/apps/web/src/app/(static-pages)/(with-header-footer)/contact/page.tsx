"use client";

import { Linkedin, X, Globe } from "lucide-react";
import Image from "next/image";
import { CDN_BASE_URL } from "@/constants/urls";
import { ContactForm } from "@/components/contact-form";
import { Toaster } from "@/components/ui/sonner";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import FacebookSvgrepoComIcon from "@/assets/icons/facebook-svgrepo-com.svg";
import Youtube168SvgrepoComIcon from "@/assets/icons/youtube-168-svgrepo-com.svg";
import LinkedinSvgrepoComIcon from "@/assets/icons/linkedin-svgrepo-com.svg";
import InstagramSvgrepoComIcon from "@/assets/icons/instagram-svgrepo-com.svg";
import { cn } from "@/lib/utils";

const ContactPage = () => {
  const handleFormSubmitSuccess = () => {
    // Handle successful form submission (e.g., redirect, show success message)
    console.log("Contact form submitted successfully");
  };

  return (
    <>
      <Toaster />
      <div className="flex items-center justify-center p-4 sm:p-8">
        <div className="container mx-auto flex h-full w-full flex-col overflow-hidden rounded-xl bg-black/90 shadow-2xl lg:flex-row">
          {/* Left Column: Form Section */}
          <div className="flex h-full flex-col justify-between gap-4 p-6 text-white sm:p-10 lg:w-1/2">
            <div>
              <h2 className="mb-8 text-3xl font-bold">Get in touch</h2>
              <GoogleReCaptchaProvider
                reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              >
                <ContactForm onSubmitSuccess={handleFormSubmitSuccess} />
              </GoogleReCaptchaProvider>
            </div>

            {/* Social Icons */}
            <div className="mt-12 flex items-center space-x-4 border-t border-gray-800 pt-6">
              {[
                {
                  href: "https://www.facebook.com/Mattheosioannoumotors",
                  icon: FacebookSvgrepoComIcon,
                  className: "size-8",
                },
                {
                  href: "https://www.youtube.com/@Mattheosioannoucy",
                  icon: Youtube168SvgrepoComIcon,
                },
                {
                  href: "https://www.instagram.com/mattheosioannoumotors/",
                  icon: InstagramSvgrepoComIcon,
                },
                {
                  href: "https://www.linkedin.com/in/mattheos-ioannou-motors-agency-ltd-20a415296/",
                  icon: LinkedinSvgrepoComIcon,
                  className: "size-7",
                },
              ].map(({ href, icon: Icon, className }, i) => (
                <a
                  key={i}
                  href={href}
                  className="hover:text-gray-400"
                  target="_blank"
                >
                  <Icon className={cn("size-10", className)} />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Abstract Visual (Placeholder) */}
          <div className="relative hidden min-h-[300px] shrink-0 bg-cover bg-center lg:block lg:min-h-auto lg:w-1/2">
            {/* A simple gradient/color overlay to represent an abstract visual */}
            <Image
              src={`${CDN_BASE_URL}/cdn/static/samples/87310679C03C426D9A7CDE20E8472F72_1DCC222787214AD7A5775430F7D992A7_020-info-slider_16-9_3840x2160_04_SM22MODPE0015.jpeg`}
              alt="Contact"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
