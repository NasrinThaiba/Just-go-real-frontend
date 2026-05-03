import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

import Header from "./Header";
import { type HeadTab } from "./Navbar";

import Top1 from "../ads/consdroid-top.png";
import Top2 from "../ads/isha-top.png";
import Top3 from "../ads/knowtran-top.png";
import Top4 from "../ads/talky-top.png";
import Top5 from "../ads/truprops-top.png";

import Right5 from "../ads/consdroid-right.png";
import Right3 from "../ads/isha-right.png";
import Right4 from "../ads/knowtran-right.png";
import Right2 from "../ads/talky-right.png";
import Right1 from "../ads/truprops-right-left.png";

import left4 from "../ads/isha-left.png";
import left1 from "../ads/knowtran-left.png";
import left5 from "../ads/talky-left.png";
import left2 from "../ads/truprops-right-left.png";
import left3 from "../ads/consdroid-left.png";

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

const topAds = [Top1, Top2, Top3, Top4, Top5];
const leftAds = [left1, left2, left3, left4, left5];
const rightAds = [Right1, Right2, Right3, Right4, Right5];

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
  const [adIndex, setAdIndex] = useState(0);

  const [isTopAdClosed, setIsTopAdClosed] = useState(false);
  const [isLeftAdClosed, setIsLeftAdClosed] = useState(false);
  const [isRightAdClosed, setIsRightAdClosed] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setAdIndex((currentIndex) => (currentIndex + 1) % topAds.length);
    }, 10000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const currentTopAd = topAds[adIndex];
  const currentLeftAd = leftAds[adIndex];
  const currentRightAd = rightAds[adIndex];

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* TOP BANNER AD */}
      <div className="relative mx-auto flex h-[200px] w-full max-w-[1088px] items-center justify-center overflow-hidden bg-gray-200">
        {!isTopAdClosed ? (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setIsTopAdClosed(true);
              }}
              className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white shadow-md transition hover:bg-red-600"
              aria-label="Close top advertisement"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="absolute left-3 top-3 z-10 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Ad
            </div>

            <a
              href="#"
              aria-label="Top advertisement"
              className="block h-full w-full"
            >
              <img
                key={currentTopAd}
                src={currentTopAd}
                alt="Top advertisement"
                className="h-full w-full object-cover transition-opacity duration-500"
              />
            </a>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs font-semibold text-slate-400">
            Advertisement closed
          </div>
        )}
      </div>

      {/* LEFT SIDE AD */}
      <div className="fixed left-[calc((100%-1420px)/2)] top-0 z-30 hidden h-[600px] w-[160px] items-center justify-center overflow-hidden bg-gray-200 lg:flex">
        {!isLeftAdClosed ? (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setIsLeftAdClosed(true);
              }}
              className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white shadow-md transition hover:bg-red-600"
              aria-label="Close left advertisement"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="absolute left-3 top-3 z-10 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Ad
            </div>

            <a
              href="#"
              aria-label="Left advertisement"
              className="block h-full w-full"
            >
              <img
                key={currentLeftAd}
                src={currentLeftAd}
                alt="Left advertisement"
                className="h-full w-full object-cover transition-opacity duration-500"
              />
            </a>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 px-3 text-center text-xs font-semibold text-slate-400">
            Advertisement closed
          </div>
        )}
      </div>

      {/* RIGHT SIDE AD */}
      <div className="fixed right-[calc((100%-1420px)/2)] top-0 z-30 hidden h-[600px] w-[160px] items-center justify-center overflow-hidden bg-gray-200 lg:flex">
        {!isRightAdClosed ? (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setIsRightAdClosed(true);
              }}
              className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white shadow-md transition hover:bg-red-600"
              aria-label="Close right advertisement"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="absolute left-3 top-3 z-10 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Ad
            </div>

            <a
              href="#"
              aria-label="Right advertisement"
              className="block h-full w-full"
            >
              <img
                key={currentRightAd}
                src={currentRightAd}
                alt="Right advertisement"
                className="h-full w-full object-cover transition-opacity duration-500"
              />
            </a>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 px-3 text-center text-xs font-semibold text-slate-400">
            Advertisement closed
          </div>
        )}
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