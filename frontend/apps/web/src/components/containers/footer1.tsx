/* eslint-disable @next/next/no-img-element */
"use client";

import FacebookSvgrepoComIcon from "@/assets/icons/facebook-svgrepo-com.svg";
import Youtube168SvgrepoComIcon from "@/assets/icons/youtube-168-svgrepo-com.svg";
import LinkedinSvgrepoComIcon from "@/assets/icons/linkedin-svgrepo-com.svg";
import InstagramSvgrepoComIcon from "@/assets/icons/instagram-svgrepo-com.svg";
import GooglePlayBadgeLogoWineIcon from "@/assets/icons/Google_Play-Badge-Logo.wine.svg";
import AppStoreIOSBadgeLogoWineIcon from "@/assets/icons/App_Store_(iOS)-Badge-Logo.wine.svg";
import { cn } from "@/lib/utils";
import Link from "next/link";
import packageInfo from "../../../package.json";
import { PRIVACY, CONTACT_US } from "@/constants/app-routes";
import Copyright from "@/components/containers/copyright";

export default function Footer() {
  return (
    <footer>
      <div className="w-full bg-neutral-900 px-6 py-14 text-white md:px-12 lg:px-20">
        <div className="container mx-auto">
          <div className="mb-14 flex flex-col items-start justify-between gap-8 md:flex-row">
            <section className="flex-1 shrink-0">
              <div className="flex items-center gap-4">
                <img
                  src="/logo-only-white.png"
                  alt="Logo"
                  className="h-16 w-24 object-contain"
                />

                <div>
                  <p className="font-heading text-lg font-semibold">
                    Mattheos Ioannou Motors
                  </p>

                  <div className="mt-1 flex flex-wrap items-center justify-start gap-3">
                    <span className="flex items-center gap-2 text-xs">
                      Delivering quality vehicles and trust since 1978.
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex flex-col items-start justify-center gap-4 md:items-start">
              <div className="text-xl font-bold">MyAutoCare+ App</div>
              <div className="flex flex-row items-center justify-end gap-12">
                <Link href="#" className="block">
                  <GooglePlayBadgeLogoWineIcon className="-mx-6 -my-10 h-32 w-auto" />
                </Link>
                <Link href="#" className="block">
                  <AppStoreIOSBadgeLogoWineIcon className="-mx-10 -my-10 h-30 w-auto" />
                </Link>
              </div>
            </div>
          </div>
          {/* Main sections */}
          <section className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3">
            {/* Locations & Contacts */}
            <div className="flex w-fit flex-col">
              <p className="mb-4 text-xl font-semibold">Locations & Contacts</p>
              <p className="mb-6 text-sm text-neutral-400">
                Do you have any questions?
              </p>

              <button className="w-full rounded-md bg-white px-6 py-3 font-medium text-black transition hover:bg-neutral-200 sm:w-auto">
                Get in touch
              </button>
            </div>

            {/* Social Media */}
            <div>
              <p className="mb-4 text-xl font-semibold">Social Media</p>
              <p className="mb-6 max-w-xs text-sm text-neutral-400">
                Get in touch with us via social media.
              </p>

              <div className="flex flex-wrap items-center gap-4">
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
                    target="_blank"
                    className="flex cursor-pointer items-center justify-center rounded-md text-white transition hover:opacity-70"
                  >
                    <Icon className={cn("size-10", className)} />
                  </a>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div className="flex justify-end gap-8 text-sm md:text-base">
              <div className="flex flex-col gap-2">
                <a className="hover:opacity-60" href="#">
                  Central
                </a>
                <a className="hover:opacity-60" href="#">
                  Career
                </a>
                <a className="hover:opacity-60" href="#">
                  Global
                </a>
                <a className="hover:opacity-60" href="#">
                  Sustainability
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <a className="hover:opacity-60" href="#">
                  Inventory
                </a>
                <a className="hover:opacity-60" href="#">
                  Special Offers
                </a>

                <a className="hover:opacity-60" href="#">
                  Find Us
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <a className="hover:opacity-60" href="#">
                  About Us
                </a>
                <a className="hover:opacity-60" href="#">
                  Find Us
                </a>

                <Link href={CONTACT_US} className="hover:opacity-60">
                  Get in Touch
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Copyright />
    </footer>
  );
}
