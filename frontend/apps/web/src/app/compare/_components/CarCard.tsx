import Image from "next/image";

interface CarCardProps {
  image: string;
  price: string;
  colors: string[];
}

export default function CarCard({ image, price, colors }: CarCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="relative h-56 w-auto">
        <Image
          src={image}
          width={224}
          height={224}
          className="object-contain"
          alt="Car"
        />
      </div>

      <div className="flex justify-center gap-2">
        {colors.map((c, i) => (
          <button
            key={i}
            className="h-4 w-4 rounded-full border"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <p className="text-sm text-gray-500">Purchase from {price}</p>

      <button className="rounded bg-black px-6 py-2 text-white">Explore</button>
    </div>
  );
}
