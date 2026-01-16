"use client";

import { useState } from "react";
import { OPTIONS2, SLIDES, SLIDES_OPTIONS } from "@/app/(home)/utils";
import CardsSlider from "@/components/containers/cardsSlider/cardsSlider";
import HomeHeader1 from "@/components/containers/homeHeader1";
import HomeSlider from "@/components/containers/homeSlider/homeSlider";
import ShoppingTools from "@/components/containers/shoppingTools";
import { Tabs } from "@/components/ui/tabs";
import VehicleSlider from "@/components/containers/vehicleSlider/vehicleSlider";
import BrandsGrid1 from "@/components/containers/brandsGrid1";
import MobileAppSection from "@/components/containers/home-sections/mobile-app";
import Newsletter from "@/components/containers/home-sections/newsletter";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import Footer1 from "@/components/containers/footer1";
import NewsSlider from "@/components/containers/newsSlider/newsSlider";
import DynamicHomeSection from "@/components/dynamic-home-section";
// import SocialMediaVideos from "@/components/containers/socialMediaVideos";
import CardList from "@/components/containers/videosCards/CardList";
import {
  useGetCarAttributes,
  useGetCarListings,
  useGetBlogs,
  useGetSlidersAll,
  SliderPlacement,
} from "@workspace/api";
import ScrollScaleContainer from "@/components/containers/scrollScaleContainer";
import SpecialOffersSlider from "@/components/containers/special-offers-slider/special-offers-slider";
import { CDN_BASE_URL } from "@/constants/urls";
import { STATIC_CONTENT_SLUG_HOME_SECTION_1 } from "@/constants/car-attributes";

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch car attributes to get car types
  const { data: carAttributes, isLoading: attributesLoading } =
    useGetCarAttributes({});

  // Get car type attribute and its children
  const carTypeAttribute = carAttributes?.find(
    (attr: any) => attr.slug === "car-type",
  );
  const carTypeOptions = carTypeAttribute?.children || [];

  // Create dynamic tabs from car types
  const dynamicTabs = [
    { id: "overview", label: "All" },
    ...carTypeOptions.map((carType: any) => ({
      id: carType.slug || "",
      label: carType.name || "",
    })),
  ];

  // Fetch car listings filtered by selected car type
  const carListingParams: any =
    activeTab === "overview"
      ? {}
      : {
          [`attribute[${carTypeAttribute?.id}]`]: activeTab,
        };

  const { data: carListingsData, isLoading: listingsLoading } =
    useGetCarListings(carListingParams);

  // Fetch sliders from API
  const { data: slidersData, isLoading: slidersLoading } = useGetSlidersAll({
    placement: SliderPlacement.SpecialOffer,
  });

  // Fetch home slider 1 cards
  const { data: homeSlider1Data, isLoading: homeSlider1Loading } =
    useGetSlidersAll({
      placement: SliderPlacement.HomeSlider1,
    });

  // Fetch blog posts for news
  const { data: blogsData, isLoading: blogsLoading } = useGetBlogs({
    pageSize: 12,
    sortBy: "created",
    sortDirection: "desc",
  });

  // Transform car listings to VehicleSlider format
  const transformedSlides =
    carListingsData?.items?.map((listing) => ({
      slug: listing?.slug || "",
      img: listing.primaryImageAbsoluteUrl || listing.primaryImage || "",
      title: listing.carModelName || "",
      description: listing.manufacturerName || "",
      price: listing.price || 0,
      bgColor: "#f5f5f5",
      year:
        new Date(listing.registrationDate || "").getFullYear() ||
        new Date().getFullYear(),
      customPriceLabel: listing?.customPriceLabel || "",
      cardFooterLabel: listing?.cardFooterLabel || "",
    })) || [];

  // Transform blog posts to NewsSlider format
  const transformedNewsSlides =
    blogsData?.items?.map((blog: any) => ({
      img: blog.coverImageAbsoluteUrl || blog.coverImage || "",
      title: blog.title || "",
      shortDesc: blog.shortDescription || "",
      date: blog.created || "",
      slug: blog.slug || "",
    })) || [];

  // Transform home slider 1 data to CardsSlider format
  const transformedHomeSlider1Cards =
    homeSlider1Data?.map((slider: any) => ({
      img: slider.imageAbsoluteUrl || slider.image || "",
      title: slider.title || "",
      description: slider.shortDescription || "",
      footNote: undefined,
    })) || [];

  const isLoading = attributesLoading || listingsLoading;

  return (
    <div className="w-full">
      <div className="relative">
        <HomeHeader1 className="absolute top-0 z-50" />
        <HomeSlider slides={SLIDES} options={SLIDES_OPTIONS} />
      </div>

      <div className="px-4 py-16">
        <div className="font-heading mb-8 text-center uppercase lg:text-2xl">
          Assist tools
        </div>
        <ShoppingTools />
      </div>

      <div className="container mx-auto">
        <hr className="border-neutral-300" />
      </div>

      <div className="py-20">
        <div className="mb-20 flex flex-col items-center justify-center gap-4 px-4">
          <div className="font-heading text-center text-xl font-bold lg:text-3xl xl:text-4xl">
            WHY CHOOSE MATTHEOS IOANNOU AUTO?
          </div>
          <div className="max-w-4xl text-center xl:text-lg">
            Looking for trusted Japanese import cars in Cyprus? Mattheos Ioannou
            Auto delivers certified, low-mileage vehicles sourced directly from
            Japan, with full inspection reports, transparent pricing, and
            reliable customer support. Premium cars, expert service, and total
            peace of mind that's why customers choose us.
          </div>
        </div>
        {homeSlider1Loading ? (
          <div className="flex justify-center py-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Loading featured content...</p>
            </div>
          </div>
        ) : transformedHomeSlider1Cards.length === 0 ? null : (
          <CardsSlider
            slides={transformedHomeSlider1Cards}
            options={OPTIONS2}
          />
        )}
      </div>

      <div className="container mx-auto">
        <hr className="border-neutral-300" />
      </div>

      <div className="py-20">
        <div className="mb-10 flex flex-col items-center justify-center gap-4 px-4">
          <div className="font-heading text-center text-xl font-bold lg:text-3xl xl:text-4xl">
            Explore All Vehicles
          </div>
        </div>

        <Tabs
          tabs={dynamicTabs}
          activeItemId={activeTab}
          onChange={setActiveTab}
          className="mx-auto mb-6 w-full"
        />

        <div className="">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
                <p className="mt-4 text-gray-600">Loading vehicles...</p>
              </div>
            </div>
          ) : transformedSlides.length === 0 ? (
            <div className="flex justify-center py-8">
              <div className="text-center">
                <p className="text-gray-600">
                  No vehicles found for this category.
                </p>
              </div>
            </div>
          ) : (
            <VehicleSlider slides={transformedSlides} />
          )}
        </div>
      </div>

      <div className="container mx-auto bg-linear-to-t from-gray-950 to-gray-900 py-20 md:bg-inherit md:from-transparent md:to-transparent md:px-4">
        <div className="font-heading mb-8 text-center text-xl font-bold text-white md:mb-20 md:text-black lg:text-3xl xl:text-4xl">
          Social Media Reels
        </div>
        <CardList />
      </div>

      {/* Sticky Image Scroll Section - Dynamic Content from API */}
      <DynamicHomeSection
        slug={STATIC_CONTENT_SLUG_HOME_SECTION_1}
        fallbackImageUrl={`${CDN_BASE_URL}/cdn/2025/12/9AA817C7777F4ED38EEF20066BB863E6_5824436E4A9949F39B65F2B8E3A40AF6_16-9_content-chapter-markenbotschafter-3840x2160_1_20251226093416_90c9e753.png`}
      />

      <div className="">
        <BrandsGrid1 />
      </div>

      <div className="container mx-auto px-4">
        {slidersLoading ? (
          <div className="flex justify-center py-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Loading featured content...</p>
            </div>
          </div>
        ) : (
          <SpecialOffersSlider
            cars={slidersData?.map((i) => ({
              slug: i?.car?.slug || "",
              name: i?.title || i?.car?.carModelName || "",
              image:
                i?.imageAbsoluteUrl || i?.car?.primaryImageAbsoluteUrl || "",
              price: i?.car?.salePrice || i?.car?.price || 0,
              bgColor: i?.bgColor || undefined,
            }))}
          />
        )}
      </div>

      <div className="py-20">
        <MobileAppSection />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="font-heading mb-4 text-xl font-bold lg:text-3xl xl:mb-8 xl:text-4xl">
          Global Car news
        </div>
        {blogsLoading ? (
          <div className="flex justify-center py-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Loading news...</p>
            </div>
          </div>
        ) : transformedNewsSlides.length === 0 ? null : (
          <NewsSlider slides={transformedNewsSlides} />
        )}
      </div>
      {/*
      <div className="container mx-auto px-4 py-20">
        <div className="font-heading mb-4 text-xl font-bold lg:text-3xl xl:mb-8 xl:text-4xl">
          Social media reels
        </div>
        <SocialMediaVideos />
      </div> */}

      {/* The animated container */}
      {/* <ScrollScaleContainer
        imageUrl="https://picsum.photos/3000"
        className="relative"
      >
        <div className="p-4 text-white md:p-8 lg:pt-16">
          <h2 className="mb-6 text-xl font-bold md:text-4xl">
            Sim Racing Action Livestreamed
          </h2>
          <p className="mb-8 text-sm md:text-lg">
            Don’t miss the action – watch it live! On the official Porsche
            Twitch Channel.
          </p>

          <button className="cursor-pointer rounded-sm bg-white/10 p-4 ring-0 transition outline-none hover:bg-white/20">
            Contact us
          </button>
        </div>
      </ScrollScaleContainer> */}

      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      >
        <Newsletter />
      </GoogleReCaptchaProvider>

      <Footer1 />
    </div>
  );
}
