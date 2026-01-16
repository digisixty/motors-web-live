import React from "react";

function CarSpecifications({
  specs,
}: {
  specs?: { label: string; value: string }[];
}) {
  return (
    <div className="mt-10 flex flex-col gap-6">
      {specs?.map((item, index) => (
        <div key={index} className="text-center">
          <div className="text-xs text-neutral-700">{item?.label}</div>
          <div className="font-heading font-bold">{item?.value}</div>
        </div>
      ))}
    </div>
  );
}

export default CarSpecifications;
