import { SlideContext } from "@/components/containers/homeSlider/SlideContext";
import { EmblaOptionsType } from "embla-carousel";
import { CircleChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useContext } from "react";
import { CDN_BASE_URL } from "@/constants/urls";
import { cn } from "@/lib/utils";

export const SLIDES_OPTIONS: EmblaOptionsType = {
  loop: true,
};
const SlideContent = ({
  video,
  mobileVideo,
  className,
}: {
  video: string;
  mobileVideo?: string;
  className?: string;
}) => {
  const { isActive } = useContext(SlideContext);

  return (
    <div className="relative h-full w-screen bg-slate-800">
      <video
        src={video}
        muted
        preload="metadata"
        loop
        autoPlay
        webkit-playsinline="webkit-playsinline"
        playsInline
        data-object-fit="cover"
        className={cn(
          "h-full w-full object-cover",
          mobileVideo ? "hidden md:block" : "",
          className,
        )}
      ></video>

      {mobileVideo && (
        <video
          src={mobileVideo}
          muted
          preload="metadata"
          loop
          autoPlay
          webkit-playsinline="webkit-playsinline"
          playsInline
          data-object-fit="cover"
          className={cn("h-full w-full object-cover md:hidden", className)}
        ></video>
      )}

      <div className="absolute right-0 bottom-1/7 left-0 flex flex-col items-center gap-4 text-white">
        <motion.div
          className="font-heading font-medium uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: isActive ? 0.2 : 0 }}
        >
          Collections
        </motion.div>
        <motion.div
          className="font-heading text-center text-3xl font-bold uppercase xl:text-4xl 2xl:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: isActive ? 0.4 : 0 }}
        >
          Start your engine
        </motion.div>
        <motion.div
          className="font-heading flex cursor-pointer items-center justify-center gap-4 text-sm font-medium uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: isActive ? 0.6 : 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          discover <CircleChevronRight className="size-10" strokeWidth={1} />
        </motion.div>
      </div>
    </div>
  );
};

export const SLIDES = [
  <SlideContent
    key={1}
    video={`${CDN_BASE_URL}/cdn/static/heading-1.mp4`}
    mobileVideo={`${CDN_BASE_URL}/cdn/static/heading-1-mobile.mp4`}
    className=""
  />,
  <SlideContent
    key={2}
    video={`${CDN_BASE_URL}/cdn/2025/12/document_5377832021378765573_20251230194608_dbbad7ac.mp4`}
    mobileVideo={`${CDN_BASE_URL}/cdn/2025/12/document_5377832021378765573_20251230194608_dbbad7ac.mp4`}
    className=""
  />,
  // <SlideContent
  //   key={1}
  //   video={`${CDN_BASE_URL}/cdn/static/samples/1763047273131.mp4`}
  // />,
  // <SlideContent
  //   key={1}
  //   video={`${CDN_BASE_URL}/cdn/static/samples/1763047273131.mp4`}
  // />,
];

export const SLIDES2 = [
  {
    img: "https://images-porsche.imgix.net/-/media/CF0AC41384E449F5B3C1D657D4526AAF_8322698AE0CA4B1DB5D06D59C913678B_CZ25W12OD0007-911-carrera-gts-driving?w=645&q=85&auto=format",
    title: "Certified Japanese Import Specialists.¹",
    description:
      "With years of experience in the Japanese import market, we hand-select vehicles from trusted Japanese auctions and suppliers. Every car undergoes full inspection, mileage verification, and quality control before shipping to Cyprus. Choose a dealership that guarantees reliable, low-mileage, premium cars — with complete transparency.",
    footNote: "Not available for 911 Carrera.",
  },
  {
    img: "https://images-porsche.imgix.net/-/media/E90B7A2B2C2743ADA127FF2CD80046D0_AD6C55140CEA4574B71A358E38E40352_CZ25W12OX0005-911-carrera-gts-side?w=598&q=85&auto=format",
    title: "Guaranteed Mileage • Full Inspection • Zero Surprises.¹",
    description:
      "Every vehicle we import or sell is checked thoroughly for quality, condition, and authenticity. From verified mileage to detailed inspection reports, we ensure you know exactly what you’re buying. Our commitment to transparency makes us one of the most trusted car dealerships in Cyprus.",
    footNote: "Not available for 911 Carrera.",
  },
  {
    img: "https://images-porsche.imgix.net/-/media/E3457498416F4FA9B4B61CCEA7E442CA_EDFD068BAF2A4D7081753DF0D0E150A9_CZ25W12OX0006-911-carrera-gts-rear?w=598&q=85&auto=format",
    title: "Premium Cars at Competitive Prices.¹",
    description:
      "Because we source cars directly from Japan, we eliminate unnecessary middlemen and reduce costs. This allows us to offer premium vehicles at prices that are often below Cyprus market value. Get the best quality-to-price ratio with Mattheos Ioannou Motors.",
    footNote: "Not available for 911 Carrera.",
  },
  {
    img: "https://images-porsche.imgix.net/-/media/BB1DC414A436488382C9AD694EFFF1D6_47C1EA28E0D148B59C5264855179E81A_CZ21MODTD0024-911-carrera-pccb-brake?w=598&q=85&auto=format",
    title: "End-to-End Service & Professional Guidance.¹",
    description:
      "From choosing the right car to import, to documentation, shipping, registration, and after-sales support, we take care of everything. Our team provides personalised assistance at every step to make your buying experience simple, secure, and stress-free.",
    footNote: "Not available for 911 Carrera.",
  },
  {
    img: "https://images-porsche.imgix.net/-/media/0E184316A2254317A9D50318DF7DF5B7_200476CC30C144BFB2B439351086909D_CZ25W12OD0006-911-carrera-gts-front?w=598&q=85&auto=format",
    title: "A Reputation Built on Trust & Customer Satisfaction.¹",
    description:
      "Customers across Cyprus trust us for our honesty, professionalism, and dependable service. Our repeat buyers and referrals are proof of our commitment to delivering high-quality cars and exceptional customer experiences. We don’t just sell cars we build relationships.",
    footNote: "Not available for 911 Carrera.",
  },
];

export const OPTIONS2: EmblaOptionsType = {
  loop: false,
  align: "center",
  containScroll: "trimSnaps",
  skipSnaps: true,
};

export const vehiclesSliderList = [
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/HLD_MY23_0015_V002_desktop.avif`,
    title: "Rav4",
    description: "Energize every adventure, big or small",
    price: 42270,
    bgColor: "rgb(227, 222, 217)",
    year: 2025,
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/CCH_MY26_0023_V001_v5.avif`,
    title: "Rav4",
    description: "Energize every adventure, big or small",
    price: 42270,
    bgColor: "rgb(185, 173, 159)",
    year: 2025,
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/RAV_MY25_0005_V001_desktop.avif`,
    title: "Rav4",
    description: "Energize every adventure, big or small",
    price: 42270,
    bgColor: "rgb(93, 78, 65)",
    year: 2025,
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/RHV_MY25_0008_V001_desktop.avif`,
    title: "Rav4",
    description: "Energize every adventure, big or small",
    price: 42270,
    bgColor: "rgb(43, 91, 89)",
    year: 2025,
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/RPH_MY25_0006_V001_desktop.avif`,
    title: "Rav4",
    description: "Energize every adventure, big or small",
    price: 42270,
    bgColor: "rgb(43, 91, 89)",
    year: 2025,
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/BZE_MY26_0018_V001.avif`,
    title: "Rav4",
    description: "Energize every adventure, big or small",
    price: 42270,
    bgColor: "rgb(40, 106, 144)",
    year: 2025,
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/HLD_MY23_0015_V002_desktop.avif`,
    title: "Rav4",
    description: "Energize every adventure, big or small",
    price: 42270,
    bgColor: "rgb(227, 222, 217)",
    year: 2025,
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/CCH_MY26_0023_V001_v5.avif`,
    title: "Rav4",
    description: "Energize every adventure, big or small",
    price: 42270,
    bgColor: "rgb(185, 173, 159)",
    year: 2025,
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/RAV_MY25_0005_V001_desktop.avif`,
    title: "Rav4",
    description: "Energize every adventure, big or small",
    price: 42270,
    bgColor: "rgb(93, 78, 65)",
    year: 2025,
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/RHV_MY25_0008_V001_desktop.avif`,
    title: "Rav4",
    description: "Energize every adventure, big or small",
    price: 42270,
    bgColor: "rgb(43, 91, 89)",
    year: 2025,
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/RPH_MY25_0006_V001_desktop.avif`,
    title: "Rav4",
    description: "Energize every adventure, big or small",
    price: 42270,
    bgColor: "rgb(43, 91, 89)",
    year: 2025,
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/BZE_MY26_0018_V001.avif`,
    title: "Rav4",
    description: "Energize every adventure, big or small",
    price: 42270,
    bgColor: "rgb(40, 106, 144)",
    year: 2025,
  },
];

export const exampleTabs = [
  { id: "overview", label: "Overview" },
  { id: "specifications", label: "SUV" },
  { id: "features", label: "Sedan" },
  { id: "hatchback", label: "Hatchback" },
  { id: "coupe", label: "Coupe" },
  { id: "hybrid", label: "Hybrid" },
];

export const NewsSlides = [
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/HLD_MY23_0015_V002_desktop.avif`,
    title:
      "A Bizarre Plan Could See Fords And Chevys Sold At Toyota’s Japanese Dealerships",
    shortDesc:
      "A one-of-a-kind 2025 911 GT3 Touring marks the debut of the new Sonderwunsch project, Icons of Latin America.",
    date: "2025-11-20T14:12:40.526Z",
    slug: "/a-bizarre-plan-could-see-fords-and-chevys-sold-at-toyotas-japanese-dealerships",
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/CCH_MY26_0023_V001_v5.avif`,
    title:
      "A Bizarre Plan Could See Fords And Chevys Sold At Toyota’s Japanese Dealerships",
    shortDesc:
      "A one-of-a-kind 2025 911 GT3 Touring marks the debut of the new Sonderwunsch project, Icons of Latin America.",
    date: "2025-11-20T14:12:40.526Z",
    slug: "/a-bizarre-plan-could-see-fords-and-chevys-sold-at-toyotas-japanese-dealerships2",
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/RAV_MY25_0005_V001_desktop.avif`,
    title:
      "A Bizarre Plan Could See Fords And Chevys Sold At Toyota’s Japanese Dealerships",
    shortDesc:
      "A one-of-a-kind 2025 911 GT3 Touring marks the debut of the new Sonderwunsch project, Icons of Latin America.",
    date: "2025-11-20T14:12:40.526Z",
    slug: "/a-bizarre-plan-could-see-fords-and-chevys-sold-at-toyotas-japanese-dealerships3",
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/RHV_MY25_0008_V001_desktop.avif`,
    title:
      "A Bizarre Plan Could See Fords And Chevys Sold At Toyota’s Japanese Dealerships",
    shortDesc:
      "A one-of-a-kind 2025 911 GT3 Touring marks the debut of the new Sonderwunsch project, Icons of Latin America.",
    date: "2025-11-20T14:12:40.526Z",
    slug: "/a-bizarre-plan-could-see-fords-and-chevys-sold-at-toyotas-japanese-dealerships4",
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/RPH_MY25_0006_V001_desktop.avif`,
    title:
      "A Bizarre Plan Could See Fords And Chevys Sold At Toyota’s Japanese Dealerships",
    shortDesc:
      "A one-of-a-kind 2025 911 GT3 Touring marks the debut of the new Sonderwunsch project, Icons of Latin America.",
    date: "2025-11-20T14:12:40.526Z",
    slug: "/a-bizarre-plan-could-see-fords-and-chevys-sold-at-toyotas-japanese-dealerships5",
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/BZE_MY26_0018_V001.avif`,
    title:
      "A Bizarre Plan Could See Fords And Chevys Sold At Toyota’s Japanese Dealerships",
    shortDesc:
      "A one-of-a-kind 2025 911 GT3 Touring marks the debut of the new Sonderwunsch project, Icons of Latin America.",
    date: "2025-11-20T14:12:40.526Z",
    slug: "/a-bizarre-plan-could-see-fords-and-chevys-sold-at-toyotas-japanese-dealerships6",
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/HLD_MY23_0015_V002_desktop.avif`,
    title:
      "A Bizarre Plan Could See Fords And Chevys Sold At Toyota’s Japanese Dealerships",
    shortDesc:
      "A one-of-a-kind 2025 911 GT3 Touring marks the debut of the new Sonderwunsch project, Icons of Latin America.",
    date: "2025-11-20T14:12:40.526Z",
    slug: "/a-bizarre-plan-could-see-fords-and-chevys-sold-at-toyotas-japanese-dealerships7",
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/CCH_MY26_0023_V001_v5.avif`,
    title:
      "A Bizarre Plan Could See Fords And Chevys Sold At Toyota’s Japanese Dealerships",
    shortDesc:
      "A one-of-a-kind 2025 911 GT3 Touring marks the debut of the new Sonderwunsch project, Icons of Latin America.",
    date: "2025-11-20T14:12:40.526Z",
    slug: "/a-bizarre-plan-could-see-fords-and-chevys-sold-at-toyotas-japanese-dealerships8",
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/RAV_MY25_0005_V001_desktop.avif`,
    title:
      "A Bizarre Plan Could See Fords And Chevys Sold At Toyota’s Japanese Dealerships",
    shortDesc:
      "A one-of-a-kind 2025 911 GT3 Touring marks the debut of the new Sonderwunsch project, Icons of Latin America.",
    date: "2025-11-20T14:12:40.526Z",
    slug: "/a-bizarre-plan-could-see-fords-and-chevys-sold-at-toyotas-japanese-dealerships9",
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/RHV_MY25_0008_V001_desktop.avif`,
    title:
      "A Bizarre Plan Could See Fords And Chevys Sold At Toyota’s Japanese Dealerships",
    shortDesc:
      "A one-of-a-kind 2025 911 GT3 Touring marks the debut of the new Sonderwunsch project, Icons of Latin America.",
    date: "2025-11-20T14:12:40.526Z",
    slug: "/a-bizarre-plan-could-see-fords-and-chevys-sold-at-toyotas-japanese-dealerships10",
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/RPH_MY25_0006_V001_desktop.avif`,
    title:
      "A Bizarre Plan Could See Fords And Chevys Sold At Toyota’s Japanese Dealerships",
    shortDesc:
      "A one-of-a-kind 2025 911 GT3 Touring marks the debut of the new Sonderwunsch project, Icons of Latin America.",
    date: "2025-11-20T14:12:40.526Z",
    slug: "/a-bizarre-plan-could-see-fords-and-chevys-sold-at-toyotas-japanese-dealerships11",
  },
  {
    img: `${CDN_BASE_URL}/cdn/static/samples/BZE_MY26_0018_V001.avif`,
    title:
      "A Bizarre Plan Could See Fords And Chevys Sold At Toyota’s Japanese Dealerships",
    shortDesc:
      "A one-of-a-kind 2025 911 GT3 Touring marks the debut of the new Sonderwunsch project, Icons of Latin America.",
    date: "2025-11-20T14:12:40.526Z",
    slug: "/a-bizarre-plan-could-see-fords-and-chevys-sold-at-toyotas-japanese-dealerships12",
  },
];
