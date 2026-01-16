import React from "react";
import Link from "next/link";
import packageInfo from "../../../package.json";
import { PRIVACY } from "@/constants/app-routes";

function Copyright() {
  return (
    <div className="bg-black px-4 py-6 text-neutral-200">
      <div className="container mx-auto flex flex-col items-center justify-between gap-2 md:flex-row">
        <div className="flex items-center gap-8">
          <div className="text-neutral-400">
            © {new Date().getUTCFullYear()} Copywrite .All Rights Reserved.
          </div>
          <div>Cookie Policy</div>
          <Link href={PRIVACY}>
            <div>Privacy policy</div>
          </Link>
          <div>Term and Condition</div>
        </div>

        <div>Website by Digi3sixty</div>
        <div className="hidden">v{packageInfo.version}</div>
      </div>
    </div>
  );
}

export default Copyright;
