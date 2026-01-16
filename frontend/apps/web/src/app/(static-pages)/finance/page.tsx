import Image from "next/image";
import Footer from "@/components/containers/footer1";
import { Metadata } from "next";
import FinanceHeader from "./_components/header";
import { CDN_BASE_URL } from "@/constants/urls";

export const metadata: Metadata = {
  title:
    "Mattheos Ioannou Motors Ltd - Your Trusted Source for High-Quality Used Cars in Cyprus",
  description:
    "Discover high-quality used cars in Cyprus at Mattheos Ioannou Motors Ltd. With over 350 offers, stress-free financing, and a minimum 12-month warranty, your dream car is just a visit away",
};

function Page() {
  return (
    <div className="flex h-fit flex-col gap-20">
      <FinanceHeader />

      <div className="container mx-auto px-2">
        <div className="flex flex-col gap-2 overflow-hidden rounded-xl bg-black lg:flex-row">
          <div className="relative h-64 w-full lg:h-auto lg:w-1/2 2xl:w-2/3">
            <Image
              src={`${CDN_BASE_URL}/cdn/2025/12/ACD6F56F2CF84440A70A3E378F8E4C23_96C85280B76A49DEBFA62AF9185562F8_AP22MODBB0010-991II--carrera-gts_20251226152816_04699eed.jpeg`}
              alt="img"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
          </div>
          <div className="flex w-full items-center justify-center py-8 text-white">
            <div className="flex max-w-3/4 flex-col gap-4">
              <h1 className="text-3xl">Approved Warranty</h1>
              <div>
                The Porsche Approved Warranty covers all components of your
                Porsche and offers the same level of service as our new car
                warranty.
              </div>

              <button className="w-fit rounded-md bg-white p-5 text-black">
                Read more
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2">
        <div className="flex flex-col gap-2 overflow-hidden rounded-xl bg-black lg:flex-row">
          <div className="flex w-full items-center justify-center py-8 text-white">
            <div className="flex max-w-3/4 flex-col gap-4">
              <h1 className="text-3xl">Approved Warranty</h1>
              <div>
                The Porsche Approved Warranty covers all components of your
                Porsche and offers the same level of service as our new car
                warranty.
              </div>

              <button className="w-fit rounded-md bg-white p-5 text-black">
                Read more
              </button>
            </div>
          </div>

          <div className="relative h-64 w-full lg:h-auto lg:w-1/2 2xl:w-2/3">
            <Image
              src={`${CDN_BASE_URL}/cdn/2025/12/8EE3BDD303FF4958B6BF482CF0B50561_6F1024A2F9AE4A88AEDAD6FA93D3D49D_PS22GENOX0004-guarantee_20251226152816_dc1013cc.jpeg`}
              alt="img"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Page;
