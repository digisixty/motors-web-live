import React from "react";

function Warranty({
  value,
  description,
}: {
  value?: string;
  description?: string;
}) {
  return (
    <div id="warranty" className="container mx-auto px-2 py-8">
      <h2 className="mb-1 text-2xl font-bold">Warranty</h2>
      <div className="mb-8">Your warranty cover includes:</div>

      <div className="flex flex-col justify-between gap-2 md:flex-row">
        <div className="flex shrink-0 gap-2">
          <div className="flex size-14 items-center justify-center rounded-xl bg-black">
            <img
              src="/logo-only-white.png"
              alt="Logo"
              className="h-6 w-auto object-contain"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-base font-bold">
              Mattheos Approved warranty
            </div>
            <div className="font-bold">{value}</div>
          </div>
        </div>

        <div className="max-w-lg">
          <div dangerouslySetInnerHTML={{ __html: description || "" }} />
        </div>
      </div>
    </div>
  );
}

export default Warranty;
