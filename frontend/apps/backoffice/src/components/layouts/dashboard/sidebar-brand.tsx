/* eslint-disable @next/next/no-img-element */
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

function SidebarBrand() {
  const { open } = useSidebar();

  return (
    <div className="flex items-center gap-3">
      <img
        src="/admin/web-app-manifest-512x512.png"
        alt="logo"
        width={64}
        height={64}
      />
      <div className={cn("flex flex-col", { hidden: !open })}>
        <div className="font-bold uppercase text-sm">Mattheos ioannou</div>
        <div className="text-xs">Motors agency</div>
      </div>
    </div>
  );
}

export default SidebarBrand;
