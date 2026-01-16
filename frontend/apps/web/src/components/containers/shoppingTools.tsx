import { Car, Cog, Phone, ShoppingCart } from "lucide-react";
import LocationIcon from "@/assets/icons/Location-Logo-Black.svg";
import MonogramIcon from "@/assets/icons/Monogram-Logo-Black.svg";
import ShapeIcon from "@/assets/icons/Shope-Logo-Black.svg";
import OffersLogo from "@/assets/icons/Offers-Logo-Black-02.svg";

const items = [
  {
    name: "Find Us",
    link: "#",
    icon: (
      <LocationIcon
        className="size-8 text-neutral-500 transition-colors group-hover:text-black"
        strokeWidth={1.5}
      />
    ),
  },
  {
    name: "Myautocare+",
    link: "#",
    icon: (
      <MonogramIcon
        className="size-8 text-neutral-500 transition-colors group-hover:text-black"
        strokeWidth={1.5}
      />
    ),
  },
  {
    name: "Inventory",
    link: "#",
    icon: (
      <ShapeIcon
        className="size-8 text-neutral-500 transition-colors group-hover:text-black"
        strokeWidth={1.5}
      />
    ),
  },
  {
    name: "Special Offers",
    link: "#",
    icon: (
      <OffersLogo
        className="size-8 text-neutral-500 transition-colors group-hover:text-black"
        strokeWidth={1.5}
      />
    ),
  },
];

function ShoppingTools() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex items-start justify-center gap-6">
        {items?.map((item, index) => {
          return (
            <a
              key={index}
              href={item?.link}
              className="group flex flex-col items-center justify-center gap-2 hover:underline"
            >
              {item?.icon}
              <div className="text-center text-xs font-medium text-neutral-600 transition-all group-hover:text-black">
                {item?.name}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default ShoppingTools;
