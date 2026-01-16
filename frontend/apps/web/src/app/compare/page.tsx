import StickySelector from "./_components/StickySelector";
import CarCard from "./_components/CarCard";
import { CDN_BASE_URL } from "@/constants/urls";
import CarSpecifications from "@/app/compare/_components/CarSpecifications";
import { Metadata } from "next";

const carSpecifications = [
  {
    label: "Acceleration (0-100 km/h)",
    value: "From 7.6 s",
  },
  {
    label: "Top speed",
    value: "180 km/h",
  },
  {
    label: "Max Engine Power (kW)",
    value: "Up to 145 kW/197 hp",
  },
  {
    label: "Electric energy consumption total (WLTP)",
    value: "–",
  },
  {
    label: "Fuel Consumption (Combined)",
    value: "6.6 - 6.7 l/100km",
  },
  {
    label: "Fuel Capacity",
    value: "54 l",
  },
];

export const metadata: Metadata = {
  title: "Compare | Car Dealership",
};

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Title */}
      <div className="mt-20 mb-16 text-center">
        <h1 className="text-4xl font-bold">Car comparison</h1>
        <p className="mt-4 text-gray-600">
          Compare car models below and find the perfect car for you.
        </p>
      </div>

      {/* Sticky Selector */}
      <StickySelector />

      {/* Car Cards */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-4 py-20 md:grid-cols-3">
        <div>
          <CarCard
            image={`${CDN_BASE_URL}/cdn/static/Bmw%20x2%20-%20M-Sport%202024%20Model.png`}
            price="€39,900"
            colors={["#d8e4ed", "#000", "#666", "#ccc", "#eee"]}
          />
          <CarSpecifications specs={carSpecifications} />
        </div>
        <div>
          <CarCard
            image={`${CDN_BASE_URL}/cdn/static/Lexus%20NX350h%202023%20Model%20Luxury%20package.avif`}
            price="€59,900"
            colors={["#d8e4ed", "#333", "#444", "#999", "#bbb"]}
          />
          <CarSpecifications specs={carSpecifications} />
        </div>
        <div>
          <CarCard
            image={`${CDN_BASE_URL}/cdn/static/Toyota%20Harrier%20Hybrid%202022%20Model%20G-package.png`}
            price="€41,730"
            colors={["#d8e4ed", "#222", "#555", "#aaa", "#e6ded3"]}
          />
          <CarSpecifications specs={carSpecifications} />
        </div>
      </div>
    </main>
  );
}
