import Image from "next/image";
import React from "react";
import DateRenderer from "@/lib/dateRenderer";
import Link from "next/link";
import { NEWS_DETAIL } from "@/constants/app-routes";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NewsCard({ title, img, slug, date, shortDesc }: any) {
  return (
    <div>
      <Link href={`${NEWS_DETAIL}/${slug}`}>
        <div className="flex flex-col gap-2 overflow-hidden">
          <div className="relative h-52 w-full overflow-hidden rounded-md md:h-56 lg:h-60">
            <Image
              src={img}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          <div className="mt-2">
            <DateRenderer date={date} />
          </div>

          <div className="line-clamp-2 font-bold">{title}</div>
          <div className="line-clamp-2 text-sm font-light">{shortDesc}</div>
        </div>
      </Link>
    </div>
  );
}

export default NewsCard;
