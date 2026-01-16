import Image from "next/image";
import {
  HOME,
  ABOUT_US,
  CONTACT_US,
  FIND_US,
  NEWS,
  LISTING,
  COMPARE,
  FINANCE,
  CUSTOMER_REVIEWS,
} from "@/constants/app-routes";
import { MenuItem } from "./types";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { CarAttributeDto } from "@workspace/api";
import { CDN_BASE_URL } from "@/constants/urls";

// Example menu structure with sub-menus
export const menuItems = ({
  catType,
}: {
  catType?: CarAttributeDto;
}): MenuItem[] => [
  {
    title: "Home",
    href: HOME,
  },
  {
    title: "Models",
    subMenu: ({ onClose }) => (
      <div className="space-y-4">
        <Link
          href={`${LISTING}?isSpecialOffer=true`}
          className="mb-8 block"
          onClick={onClose}
        >
          <div className="relative h-40 overflow-hidden rounded-md lg:h-56">
            <Image
              src={`${CDN_BASE_URL}/cdn/static/samples/RAV_MY25_0005_V001_desktop.avif`}
              alt="Special offers"
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute right-0 bottom-0 left-0 z-10 flex items-center justify-between bg-linear-to-t from-black to-transparent px-3 pt-10 pb-3 text-sm text-white">
              Special offers
              <ChevronRight />
            </div>
          </div>
        </Link>
        {catType?.children?.map((item) => (
          <Link
            key={item?.id}
            href={`${LISTING}?attribute[${catType?.id}]=${item?.slug}`}
            onClick={onClose}
            className="flex flex-col gap-1"
          >
            {item?.absoluteImageUrl && (
              <div className="group relative h-32 rounded-md p-2 transition-all hover:bg-white">
                <Image
                  src={item?.absoluteImageUrl || ""}
                  alt={item?.name || "Model"}
                  fill
                  className="object-contain transition-all duration-500 group-hover:translate-x-2"
                  sizes="100vw"
                />
              </div>
            )}
            <div className="text-neutral-700">{item?.name}</div>
          </Link>
        ))}
      </div>
    ),
  },
  {
    title: "Listing",
    href: LISTING,
  },
  {
    title: "Compare",
    href: COMPARE,
  },
  {
    title: "About Us",
    href: ABOUT_US,
  },
  {
    title: "Finance",
    href: FINANCE,
  },
  {
    title: "Customer Reviews",
    href: CUSTOMER_REVIEWS,
  },
  {
    title: "News",
    href: NEWS,
  },
  {
    title: "Find a Dealer",
    subMenu: [
      {
        title: "Dealer Locator",
        href: FIND_US,
        description: "Find nearby dealers",
      },
      {
        title: "Contact Us",
        href: CONTACT_US,
        description: "Get in touch",
      },
    ],
  },
];
