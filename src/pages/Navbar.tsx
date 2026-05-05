import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export type HeadTab = "news" | "video" | "viral";

type Props = {
  activeHead: HeadTab;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  language: "ta" | "en";
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
  language,
}: Props): React.ReactElement {
  const { t, i18n } = useTranslation();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const config = NAV_KEYS[activeHead];

  const moreLabel = language === "ta" ? "மேலும்" : "More";

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [i18n, language]);

  useEffect(() => {
    setOpen(false);
  }, [activeHead, activeCategory]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const buttonTextClass =
    language === "ta"
      ? "text-[12px] leading-none md:text-[13px]"
      : "text-[13px] leading-none md:text-sm";

  return (
    <nav className="relative z-40 border-b border-border bg-background">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-2 py-2 md:px-6">
        {/* MAIN CATEGORY SCROLL AREA */}
        <div></div>
        <div className="flex justify-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-2">
            {config.main.map((key) => {
              const isActive = activeCategory === key;
              const label = t(`navbar.${activeHead}.main.${key}`);

              return (
                <button
                  key={`${activeHead}-${key}-${language}`}
                  type="button"
                  onClick={() => {
                    onCategoryChange(key);
                    setOpen(false);
                  }}
                  title={label}
                  className={`shrink-0 whitespace-nowrap rounded-full px-3 py-2 font-semibold transition${
                    buttonTextClass
                  } ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* MORE DROPDOWN */}
        <div className="flex justify-end" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className={`rounded-full px-3 py-2 font-semibold ${
              buttonTextClass
            } ${
              open
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            ⠿ {moreLabel}
          </button>

          {open && (
            <div className="absolute right-0 top-full z-[9999] mt-2 w-72 rounded-xl border border-border bg-popover p-2 shadow-xl">
              <div className="flex flex-col gap-1">
                {config.more.map((key) => {
                  const isActive = activeCategory === key;
                  const label = t(`navbar.${activeHead}.more.${key}`);

                  return (
                    <button
                      key={`${activeHead}-${key}-${language}`}
                      type="button"
                      onClick={() => {
                        onCategoryChange(key);
                        setOpen(false);
                      }}
                      title={label}
                      className={`whitespace-nowrap rounded-lg px-3 py-2 text-left font-semibold transition ${
                        language === "ta" ? "text-[13px]" : "text-sm"
                      } ${
                        isActive
                          ? "bg-accent text-accent-foreground"
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