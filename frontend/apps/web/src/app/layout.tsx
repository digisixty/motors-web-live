import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";
import FullScreenLoader from "@/components/FullScreenLoader";
import Providers from "@/app/providers";
import { Toaster } from "@/components/ui/sonner";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Mattheos Ioannou Motors Agency - Shop New and Used Cars",
  description:
    "Discover Mattheos Ioannou Motors Agency for a wide selection of new and used cars. Your trusted destination for quality vehicles and exceptional service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${orbitron.variable} h-full antialiased`}>
        <FullScreenLoader />
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
