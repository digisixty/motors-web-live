"use client";

export default function StickySelector() {
  return (
    <div className="sticky top-0 z-10 border-b bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4 px-4 py-4">
        <select className="rounded border px-3 py-2">
          <option>XC40 — Mild Hybrid</option>
          <option>Other model</option>
        </select>

        <select className="rounded border px-3 py-2">
          <option>EC40 — Electric</option>
          <option>Other model</option>
        </select>

        <select className="rounded border px-3 py-2">
          <option>EX30 — Electric</option>
          <option>Other model</option>
        </select>
      </div>
    </div>
  );
}
