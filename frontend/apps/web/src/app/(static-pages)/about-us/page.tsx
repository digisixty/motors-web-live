import Image from "next/image";
import BoxWithImage from "@/app/(static-pages)/about-us/_components/boxWithImage";
import AboutUsHeader from "@/app/(static-pages)/about-us/_components/header";
import Footer from "@/components/containers/footer1";
import { CDN_BASE_URL } from "@/constants/urls";
import { Metadata } from "next";
import FacebookSvgrepoComIcon from "@/assets/icons/facebook-svgrepo-com.svg";
import Youtube168SvgrepoComIcon from "@/assets/icons/youtube-168-svgrepo-com.svg";
import LinkedinSvgrepoComIcon from "@/assets/icons/linkedin-svgrepo-com.svg";
import InstagramSvgrepoComIcon from "@/assets/icons/instagram-svgrepo-com.svg";
import { cn } from "@/lib/utils";
import SectionNav from "@/components/SectionNav";

export const metadata: Metadata = {
  title:
    "Mattheos Ioannou Motors Ltd - Your Trusted Source for High-Quality Used Cars in Cyprus",
  description:
    "Discover high-quality used cars in Cyprus at Mattheos Ioannou Motors Ltd. With over 350 offers, stress-free financing, and a minimum 12-month warranty, your dream car is just a visit away",
};

const sections = [
  { id: "about", label: "About" },
  { id: "advantages", label: "Myautocare+ App" },
  { id: "follow-us", label: "Follow Us" },
  { id: "features", label: "Features" },
];

function Page() {
  return (
    <div className="flex h-fit flex-col">
      <AboutUsHeader />
      <h2 className="px-4 py-12 text-center text-2xl font-bold">
        WELCOME TO THE <span>MATTHEOS IOANNOU MOTORS LTD</span>
      </h2>
      <SectionNav sections={sections} />
      <section
        id="about"
        className="mx-auto mt-8 flex max-w-5xl flex-col gap-4 px-4"
      >
        <div className="grid grid-cols-2 grid-rows-1 gap-4 lg:grid-rows-1">
          <div className="relative col-span-2 h-48 w-full md:h-60 lg:order-2 lg:col-span-1 lg:h-72 xl:h-80">
            <Image
              src={`${CDN_BASE_URL}/cdn/static/samples/5CA24E89999548A9B9CE9046715C2294_D34DAB20774E4DA0AC7024527AEA4E8E_019-editorial_16-9_3840x2160_01_SM22V04OD0008.jpeg`}
              alt="img"
              fill
              className="rounded-lg object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="relative h-24 w-full self-start justify-self-end md:h-36 lg:order-1 lg:h-52 xl:h-60">
            <Image
              src={`${CDN_BASE_URL}/cdn/static/samples/6990CA3D6E6547A28D1FBFF3F33BBD53_C471D64A55F1430AAE7EB2F29D70777D_019-editorial_16-9_3840x2160_02_SM22V04ID0001.jpeg`}
              alt="img"
              fill
              className="rounded-lg object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="relative h-24 w-full self-start justify-self-end md:h-36 lg:order-3 lg:-mt-20 lg:w-1/2 xl:h-48 xl:w-2/3">
            <Image
              src={`${CDN_BASE_URL}/cdn/static/samples/24490188DF0740879B4AC81DF28EB6A8_9FD68C6180244B51B69EA36BBA579F51_019-editorial_16-9_3840x2160_03_SM22J4COD0006.jpeg`}
              alt="img"
              fill
              className="rounded-lg object-cover"
              sizes="(max-width: 768px) 50vw, 16vw"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-3 font-normal md:px-8 md:pt-8 lg:order-4 lg:col-span-1">
            <p>
              <title>About Us</title>
              We offer high-quality vehicles at unbelievable prices — and we
              make your buying experience truly enjoyable. Mattheos Ioannou
              Motors Agency Ltd, part of the Mattheos Ioannou Group of
              Companies, was founded by our chairman, Mattheos Ioannou. What
              began as a childhood passion in Cyprus grew into a lifelong vision
              that built an automotive legacy. Mattheos’ journey started in
              1978, shortly after turning 18. He purchased his first car, resold
              it for a profit, and within a year had traded six more.His talent
              and passion were undeniable. By 1979, at just 19 years old, he
              took the bold step of entering the used-car market professionally.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto my-16 max-w-2xl px-4 md:px-2">
        <p>
          From our humble beginnings in Limassol — with a small bonded yard
          housing only four cars — the company grew steadily through hard
          work,integrity, and exceptional customer service. In March 1983,
          Mattheos officially incorporated Motors Agency. As demand increased,
          we moved to larger facilities to expand our stock and better serve our
          customers. In 1999, we relocated to our current bonded yard on
          Elassonos 2 Street, Limassol. Mattheos’ leadership and reputation were
          further recognized when he served as President of the Cyprus Cars
          Trading Association (ΠΑ.Σ.Ε.Α.) for 13 consecutive years (2000–2013) —
          a clear testament to the respect he holds within the industry. Today,
          we remain an independent, family-run company working closely with
          trusted partners. We are one of the oldest and most established car
          dealerships in Cyprus, offering a wide selection of high-quality
          Japanese and European vehicles. With decades of experience and
          long-standing connections across the automotive industry, we provide
          vehicles of exceptional quality a standard we believe sets us apart.
          Because we trust our stock, every vehicle we sell comes with a minimum
          24-month warranty. Our commitment to quality and service ensures that
          we not only help you find the car of your dreams but also provide the
          after-sales support and reliability you deserve.
        </p>
      </div>

      <section id="advantages">
        <BoxWithImage />
      </section>

      <section id="follow-us">
        <div className="my-16 flex flex-col items-center justify-center gap-8 bg-black py-10">
          <h2 className="text-xl text-white md:text-2xl 2xl:text-3xl">
            Follow us
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            {[
              { icon: FacebookSvgrepoComIcon, className: "size-8" },
              { icon: Youtube168SvgrepoComIcon },
              { icon: InstagramSvgrepoComIcon },
              { icon: LinkedinSvgrepoComIcon, className: "size-7" },
            ].map(({ icon: Icon, className }, i) => (
              <button
                key={i}
                className="flex cursor-pointer items-center justify-center rounded-md text-white transition hover:opacity-70"
              >
                <Icon className={cn("size-10", className)} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="container mx-auto flex flex-col gap-8 px-4 pb-20 md:gap-28"
      >
        <div className="flex min-h-50 flex-col overflow-hidden rounded-lg bg-neutral-200 md:gap-8 lg:flex-row">
          <div className="relative h-52 w-full shrink-0 lg:h-full lg:w-1/2 xl:w-2/3">
            <Image
              src={`${CDN_BASE_URL}/cdn/static/samples/E0FDA6C33C244EFD865A83E85E7ADE87_38BBFFD1682B4237944241D53A2BDB2B_003-content-info_16-9_1920x1080_MyPorsche_Registration_Step1.jpeg`}
              alt="bg"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
          </div>

          <div className="flex flex-col items-start justify-center px-8 py-8 md:py-4">
            <div className="font-heading pb-4 text-xl font-bold">
              MyAutoCare+ Registration
            </div>
            <div>
              Register for MyAutoCare+ and get instant access to all the
              benefits offered exclusively to Mattheos Ioannou Motors customers.
              With your personal account, you can view your vehicle information,
              warranty details, and service options in just a few simple steps.
            </div>
          </div>
        </div>

        <div className="flex min-h-50 flex-col overflow-hidden rounded-lg bg-neutral-200 md:gap-8 lg:flex-row">
          <div className="order-2 relative h-52 w-full shrink-0 lg:h-full lg:w-1/2 xl:w-2/3">
            <Image
              src={`${CDN_BASE_URL}/cdn/static/samples/020656A56B20470EAD23632DEEEDE210_24BD62B9EFFE44E098746D6815286AE8_003-content-info_16-9_1920x1080_MyPorsche_Registration_Step2.jpeg`}
              alt="bg"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
          </div>

          <div className="flex flex-col items-start justify-center px-8 py-8 md:py-4">
            <div className="font-heading pb-4 text-xl font-bold">
              Link Your Vehicle
            </div>
            <div>
              After creating your account, your purchased vehicle is securely
              linked to MyAutoCare+. This gives you direct access to your car's
              specifications, registration data, service reminders, and engine
              warranty status all in one place.
            </div>
          </div>
        </div>

        <div className="flex min-h-50 flex-col overflow-hidden rounded-lg bg-neutral-200 md:gap-8 lg:flex-row">
          <div className="relative h-52 w-full shrink-0 lg:h-full lg:w-1/2 xl:w-2/3">
            <Image
              src={`${CDN_BASE_URL}/cdn/static/samples/BEF93B8FB08B4273AB6AB8EE5EFBA3DF_528BE2860C82401B9CF5825F4E5B3F8B_003-content-info_16-9_1920x1080_MyPorsche_Registration_Step3.jpeg`}
              alt="bg"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
          </div>

          <div className="flex flex-col items-start justify-center px-8 py-8 md:py-4">
            <div className="font-heading pb-4 text-xl font-bold">
              Start Your MyAutoCare+ Experience
            </div>
            <div>
              Once everything is set up, you can begin enjoying the full
              experience of MyAutoCare+. Book services with our trusted
              mechanics, monitor your warranty, and stay connected to your
              vehicle anytime, anywhere — all designed exclusively for our
              valued customers.
            </div>
          </div>
        </div>

        <div className="flex min-h-50 flex-col overflow-hidden rounded-lg bg-neutral-200 md:gap-8 lg:flex-row">
          <div className="order-2 relative h-52 w-full shrink-0 lg:h-full lg:w-1/2 xl:w-2/3">
            <Image
              src={`${CDN_BASE_URL}/cdn/static/samples/6F446856F9C44F6BBC7D6D53EFEEDD60_C3F8810699DA4126BC50340CE5B3E032_003-content-info_16-9_1920x1080_04_SM22P4GOD0001.jpeg`}
              alt="bg"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
          </div>

          <div className="flex flex-col items-start justify-center px-8 py-8 md:py-4">
            <div className="font-heading pb-4 text-xl font-bold">
              Download MyAutoCare+
            </div>
            <div>
              Ready to get started? Download MyAutoCare+ from the App Store or
              Google Play and enjoy full access to your vehicle information,
              warranty tracking, and service booking — exclusively for customers
              of Mattheos Ioannou Motors Ltd.
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Page;
