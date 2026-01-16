"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Car,
  CheckSquare,
  Command,
  FileText,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Tags,
  Building,
  Cog,
  MessageSquare,
  ImageIcon,
  Settings,
  Users,
  Mail,
  Layout,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "@/components/layouts/dashboard/team-switcher";
import { NavMain } from "@/components/layouts/dashboard/nav-main";
import { NavProjects } from "@/components/layouts/dashboard/nav-projects";
import { NavUser } from "@/components/layouts/dashboard/nav-user";
import SidebarBrand from "@/components/layouts/dashboard/sidebar-brand";
import { useGetProfile } from "@workspace/api/src/auto-generated/apis/profile/profile";
import { SliderPlacement } from "@workspace/api/index";

const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "General",
      url: "/media-manager",
      icon: Settings,
      isActive: true,
      items: [
        {
          title: "Media Manager",
          url: "/media-manager",
        },
      ],
    },
    {
      title: "Car Listings",
      url: "/car-listings",
      icon: Car,
      isActive: true,
      items: [
        {
          title: "All Cars",
          url: "/car-listings",
        },
      ],
    },
    {
      title: "Car Attributes",
      url: "/car-attributes",
      icon: Tags,
      isActive: true,
      items: [
        {
          title: "Manufacturers",
          url: "/manufacturers",
        },
        {
          title: "Models",
          url: "/car-models",
        },
        {
          title: "Attributes",
          url: "/car-attributes",
        },
        {
          title: "Options",
          url: "/car-options",
        },
      ],
    },
    {
      title: "Sliders",
      url: "/sliders",
      icon: ImageIcon,
      isActive: true,
      items: [
        {
          title: "Special offers",
          url: `/sliders?placement=${SliderPlacement?.SpecialOffer}`,
        },
        {
          title: "Reels",
          url: `/sliders?placement=${SliderPlacement?.Reels}`,
        },
        {
          title: "Home Slider 1",
          url: `/sliders?placement=${SliderPlacement?.HomeSlider1}`,
        },
      ],
    },
    {
      title: "Static Contents",
      url: "/static-contents",
      icon: Layout,
      isActive: true,
      items: [
        {
          title: "All Static Contents",
          url: "/static-contents",
        },
      ],
    },
    {
      title: "Blogs",
      url: "/blogs",
      icon: FileText,
      isActive: true,
      items: [
        {
          title: "All Blogs",
          url: "/blogs",
        },
      ],
    },
    {
      title: "Inquiries",
      url: "/contact-submissions",
      icon: MessageSquare,
      isActive: true,
      items: [
        {
          title: "Contact Submissions",
          url: "/contact-submissions",
        },
        {
          title: "Test Drive Submissions",
          url: "/test-drive-submissions",
        },
      ],
    },
    {
      title: "Newsletter",
      url: "/newsletter-subscriptions",
      icon: Mail,
      isActive: true,
      items: [
        {
          title: "Subscriptions",
          url: "/newsletter-subscriptions",
        },
      ],
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "Users",
          url: "/users",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: profileData, isLoading, error } = useGetProfile();

  const user = profileData
    ? {
        name: profileData.userName || "User",
        email: profileData.email || "",
        avatar: "",
      }
    : {
        name: "Loading...",
        email: "",
        avatar: "",
      };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarBrand />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
