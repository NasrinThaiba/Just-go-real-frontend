import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export type HeadTab = "news" | "video" | "viral";

type Props = {
  activeHead: HeadTab;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  language: "en" | "ta"; // ✅ USE THIS
};

const NAV_KEYS = {
  news: {
    main: [
      "home",
      "news",
      "trendingTopics",
      "world",
      "sirInStates",
      "middleEastConflict",
    ],
    more: [
      "football",
      "featured",
      "dailyShare",
      "autoZone",
      "movies",
      "businessFinance",
    ],
  },
  video: {
    main: ["news", "liveTv", "moviesEntertainment", "humour"],
    more: ["sports", "music", "interviews", "shortVideos"],
  },
  viral: {
    main: [
      "all",
      "greetings",
      "thoughtForTheDay",
      "healthLifestyle",
      "trending",
      "friendship",
    ],
    more: ["motivation", "love", "memes", "festival"],
  },
} as const;

export const DEFAULT_CATEGORY_BY_HEAD: Record<HeadTab, string> = {
  news: "home",
  video: "news",
  viral: "all",
};

export default function Navbar({
  activeHead,
  activeCategory,
  onCategoryChange,
  language, // ✅ RECEIVE HERE
}: Props): React.ReactElement {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const config = NAV_KEYS[activeHead];

  // ✅ USE language instead of i18n.language
  const moreLabel = language === "ta" ? "மேலும்" : "More";

  useEffect(() => {
    setOpen(false);
  }, [activeHead]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="relative z-10 mx-auto max-w-6xl overflow-visible bg-background border-b border-border px-4 py-2 md:px-6">
      <div className="flex w-full flex-wrap items-center justify-center gap-1 text-sm font-medium md:flex-nowrap">

        {config.main.map((key) => {
          const isActive = activeCategory === key;

          // ✅ FORCE re-render on language change
          const label = t(`navbar.${activeHead}.main.${key}`);

          return (
            <button
              key={`${key}-${language}`} // ✅ IMPORTANT FIX
              onClick={() => {
                onCategoryChange(key);
                setOpen(false);
              }}
              className={`rounded-md px-3 py-2 transition-all duration-200 ${
                isActive
                  ? "bg-accent text-accent-foreground font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {label}
            </button>
          );
        })}

        {/* MORE DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className={`rounded-md px-3 py-2 font-semibold ${
              open
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            ⠿ {moreLabel}
          </button>

          {open && (
            <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-md border border-border bg-popover p-2 shadow-md">
              <div className="flex flex-col gap-1">
                {config.more.map((key) => {
                  const isActive = activeCategory === key;
                  const label = t(`navbar.${activeHead}.more.${key}`);

                  return (
                    <button
                      key={`${key}-${language}`} // ✅ IMPORTANT FIX
                      onClick={() => {
                        onCategoryChange(key);
                        setOpen(false);
                      }}
                      className={`rounded-md px-3 py-2 text-left text-sm ${
                        isActive
                          ? "bg-accent text-accent-foreground font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}