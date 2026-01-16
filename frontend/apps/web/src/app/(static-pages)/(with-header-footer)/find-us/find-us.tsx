"use client";

import { Clock9, Mail, MapPin, Phone } from "lucide-react";
import dynamic from "next/dynamic";

const MyMap = dynamic(
  () =>
    import("@/components/containers/map").then((mod) => ({
      default: mod.default,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-xl bg-gray-200"></div>
    ),
  },
);

export default function Locations() {
  return (
    <main className="md:min-h-screen-minus-header container mx-auto flex flex-col gap-4 p-6">
      <div className="py-4">
        <h1 className="text-center font-sans! text-3xl font-bold">Find Us</h1>
        <div className="text-center text-lg">Find Our Car Dealrship</div>
      </div>
      <div className="flex w-full flex-1 shrink-0 flex-col gap-6 md:flex-row">
        {/* LEFT PANEL */}
        <aside className="order-last flex w-full flex-col gap-4 rounded-xl border border-neutral-100 bg-white p-7 shadow-md md:order-none md:w-[370px]">
          <h2 className="mb-4 py-8 text-lg font-semibold">Our Showroom</h2>

          <div className="flex items-center justify-start gap-3 text-neutral-800">
            <MapPin />
            <p>
              Elassonos 2, Kato Polemidia, <br />
              4153, Limassol , Cyprus
            </p>
          </div>
          <div className="flex items-center justify-start gap-3 text-neutral-800">
            <Phone />
            <p>+357 25 399100</p>
          </div>
          <div className="flex items-center justify-start gap-3 text-neutral-800">
            <Mail />
            <p>info@Motors.com</p>
          </div>
          <div className="flex items-center justify-start gap-3 text-neutral-800">
            <Clock9 />
            <div>
              <p>Mon - Fri: 08:00 - 18:00</p>
              <p>Sat: 09:00 - 13:00</p>
            </div>
          </div>
        </aside>

        {/* MAP */}
        <section className="min-h-[400px] flex-1 overflow-hidden rounded-xl md:min-h-0">
          <MyMap />
        </section>
      </div>
    </main>
  );
}
