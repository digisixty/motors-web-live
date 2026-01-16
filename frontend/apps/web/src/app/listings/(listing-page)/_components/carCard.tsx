import Image from "next/image";
import { TCar } from "@/app/listings/(listing-page)/_components/types";
import { DISALLOWED_ATTRIBUTES } from "@/constants/car-attributes";
import { CDN_BASE_URL } from "@/constants/urls";
import PriceRenderer from "@/lib/priceRenderer";

function CarCard({
  id: carId,
  primaryImageAbsoluteUrl,
  primaryImage,
  stockNumber,
  isSold,
  isSpecialOffer,
  carListingAttributes,
  manufacturerName,
  carModelName,
  price: carPrice,
}: TCar) {
  const id = carId?.toString() || "";
  const img =
    primaryImageAbsoluteUrl ||
    primaryImage ||
    `${CDN_BASE_URL}/cdn/static/samples/Screenshot%20from%202025-11-17%2018-01-46.png`;
  const title = `${manufacturerName || "Unknown"} ${carModelName || "Model"}`;
  const price = carPrice || 0;

  return (
    <div className="flex h-full flex-col rounded-xl bg-[#F2F0EF] p-4 transition-all hover:shadow-lg">
      <div className="relative mb-4 h-48 w-full">
        <Image
          src={img || "/placeholder-car.jpg"}
          alt={title}
          fill
          className="rounded-xl border border-stone-200 bg-[#F2F0EF] object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {isSold && (
          <div className="absolute top-0 right-0 rounded-tl-xl rounded-br-xl bg-red-600 px-2 py-1 text-xs font-bold text-white">
            SOLD
          </div>
        )}
        {isSpecialOffer && !isSold && (
          <div className="absolute top-0 left-0 rounded-tr-xl rounded-bl-xl bg-green-600 px-2 py-1 text-xs font-bold text-white">
            SPECIAL OFFER
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <div className="font-heading text-lg font-bold">{title}</div>
            {stockNumber && (
              <div className="text-xs text-slate-600">Stock #{stockNumber}</div>
            )}
            <div className="text-sm font-semibold text-neutral-800">
              <PriceRenderer price={price || 0} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {carListingAttributes
              ?.filter(
                (a) =>
                  !a.carAttributeParentId &&
                  a.carAttributeSlug &&
                  !DISALLOWED_ATTRIBUTES?.includes(a.carAttributeSlug),
              )
              ?.map((item) => (
                <div className="flex justify-between">
                  <div className="text-xs text-slate-700">
                    {item?.carAttributeName}
                  </div>
                  <div className="font-heading text-sm font-semibold">
                    {item?.value || "N/A"}
                  </div>
                </div>
              ))}
            {/* {topSpeed && topSpeed !== "N/A" && (
            <div className="flex justify-between">
              <div className="text-xs text-slate-700">Top Speed</div>
              <div className="font-heading text-sm font-semibold">
                {topSpeed}
              </div>
            </div>
          )}
          {power && power !== "N/A" && (
            <div className="flex justify-between">
              <div className="text-xs text-slate-700">Power</div>
              <div className="font-heading text-sm font-semibold">{power}</div>
            </div>
          )} */}
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <div
            className={`font-heading flex-1 cursor-pointer rounded-xl px-1 py-3 pb-3.5 text-center text-sm leading-5 font-bold uppercase ${
              isSold
                ? "cursor-not-allowed bg-gray-400 text-gray-200"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {isSold ? "Sold" : "Explore"}
          </div>
          <div className="font-heading flex-1 cursor-pointer rounded-xl border border-gray-300 bg-white px-2 py-3 pb-3.5 text-center text-sm leading-5 font-bold text-black uppercase hover:bg-gray-50">
            Compare
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarCard;
