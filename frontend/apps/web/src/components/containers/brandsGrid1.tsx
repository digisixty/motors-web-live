import { ChevronRight } from "lucide-react";
import React from "react";
import Link from "next/link";
import { LISTING } from "@/constants/app-routes";

// Import SVG components as React components
import MercedesLogo from "@/assets/logos/mercedes-benz.svg";
import BmwLogo from "@/assets/logos/bmw.svg";
import LexusLogo from "@/assets/logos/lexus.svg";
import FerrariLogo from "@/assets/logos/ferrari.svg";
import MazdaLogo from "@/assets/logos/mazda.svg";
import ToyotaLogo from "@/assets/logos/toyota.svg";
import HondaLogo from "@/assets/logos/honda.svg";
import NissanLogo from "@/assets/logos/nissan.svg";
import SuzukiLogo from "@/assets/logos/suzuki.svg";
import LandRoverLogo from "@/assets/logos/land-rover.svg";

const brands = [
  {
    name: "Mercedes",
    logo: MercedesLogo,
  },
  {
    name: "BMW",
    logo: BmwLogo,
  },
  {
    name: "Lexus",
    logo: LexusLogo,
  },
  {
    name: "Ferrari",
    logo: FerrariLogo,
  },
  {
    name: "Mazda",
    logo: MazdaLogo,
  },
  {
    name: "Toyota",
    logo: ToyotaLogo,
  },
  {
    name: "Honda",
    logo: HondaLogo,
  },
  {
    name: "Nissan",
    logo: NissanLogo,
  },
  {
    name: "Suzuki",
    logo: SuzukiLogo,
  },
  {
    name: "Land rover",
    logo: LandRoverLogo,
  },
];

function BrandsGrid1() {
  return (
    <div className="group relative overflow-hidden bg-white p-8">
      <div className="mx-auto grid max-w-4xl grid-cols-5 gap-2">
        {brands.map((brand, index) => (
          <div key={index} className="flex h-24 items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white">
              <brand.logo
                className="h-12 w-12 fill-black"
                aria-label={brand.name}
              />
            </div>
          </div>
        ))}
      </div>
      <Link
        href={LISTING}
        className="font-heading absolute top-0 right-0 bottom-0 left-0 flex cursor-pointer items-center justify-center gap-3 bg-black/50 font-bold text-white opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100"
      >
        Inventory <ChevronRight />
      </Link>
    </div>
  );
}

export default BrandsGrid1;
