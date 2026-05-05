import type { ReactNode } from "react";

import Header from "./Header";
import { type HeadTab } from "./Navbar";
import ImageAd from "@/components/ImageAd";

type Props = {
  children: ReactNode;

  activeHead: HeadTab;
  activeCategory: string;

  selectedLocation: string;
  onLocationChange: (location: string) => void;

  language: "en" | "ta";
  onLanguageChange: (lang: "en" | "ta") => void;

  onHeadChange: (tab: HeadTab) => void;
  onCategoryChange: (category: string) => void;
};

const topAds = [
  "/ads/consdroid-top.webp",
  "/ads/isha-top.webp",
  "/ads/knowtran-top.webp",
  "/ads/talky-top.webp",
  "/ads/truprops-top.webp",
];

const leftAds = [
  "/ads/knowtran-left.webp",
  "/ads/truprops-right-left.webp",
  "/ads/consdroid-left.webp",
  "/ads/isha-left.webp",
  "/ads/talky-left.webp",
];

const rightAds = [
  "/ads/truprops-right-left.webp",
  "/ads/talky-right.webp",
  "/ads/isha-right.webp",
  "/ads/knowtran-right.webp",
  "/ads/consdroid-right.webp",
];

export default function MainLayout({
  children,
  activeHead,
  activeCategory,
  selectedLocation,
  onLocationChange,
  language,
  onLanguageChange,
  onHeadChange,
  onCategoryChange,
}: Props) {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* TOP BANNER AD */}
      <div className="mx-auto flex w-full max-w-[1088px] items-center justify-center">
        <ImageAd
          ads={topAds}
          label="Top banner advertisement"
          size="top"
          priority
        />
      </div>

      {/* LEFT SIDE AD */}
      <div className="fixed left-[calc((100%-1420px)/2)] top-0 z-30 hidden lg:block">
        <ImageAd
          ads={leftAds}
          label="Left side advertisement"
          size="side"
        />
      </div>

      {/* RIGHT SIDE AD */}
      <div className="fixed right-[calc((100%-1420px)/2)] top-0 z-30 hidden lg:block">
        <ImageAd
          ads={rightAds}
          label="Right side advertisement"
          size="side"
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <Header
          activeHead={activeHead}
          activeCategory={activeCategory}
          selectedLocation={selectedLocation}
          onLocationChange={onLocationChange}
          language={language}
          onLanguageChange={onLanguageChange}
          onHeadChange={onHeadChange}
          onCategoryChange={onCategoryChange}
        />

        {children}
      </div>
    </div>
  );
}