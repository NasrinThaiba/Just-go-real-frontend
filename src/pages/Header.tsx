import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import Navbar, { DEFAULT_CATEGORY_BY_HEAD, type HeadTab } from "./Navbar";
import LocationSelector from "@/components/location";
import Name from "../assets/Name.png";

import {
  getAuthUser,
  getProfileByPhone,
  saveUserProfile,
  type UserProfile,
} from "@/utils/authStorage";

type Props = {
  language: "en" | "ta";
  onLanguageChange: (lang: "en" | "ta") => void;

  activeHead: HeadTab;
  activeCategory: string;

  selectedLocation: string;
  onLocationChange: (location: string) => void;

  onHeadChange: (tab: HeadTab) => void;
  onCategoryChange: (category: string) => void;
};

function getLoggedInProfile(): UserProfile | null {
  const authUser = getAuthUser();

  if (!authUser?.phone) return null;

  return getProfileByPhone(authUser.phone);
}

function updateProfilePreferences(data: {
  location?: string;
  language?: "en" | "ta";
}) {
  const profile = getLoggedInProfile();

  if (!profile) return;

  saveUserProfile({
    ...profile,
    location: data.location ?? profile.location,
    language: data.language ?? profile.language,
    updatedAt: new Date().toISOString(),
  });
}

export default function Header({
  language,
  onLanguageChange,
  activeHead,
  activeCategory,
  selectedLocation,
  onLocationChange,
  onHeadChange,
  onCategoryChange,
}: Props): React.ReactElement {
  const { t, i18n } = useTranslation();

  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement | null>(null);

  // ✅ Load location + language from saved profile
  useEffect(() => {
    const profile = getLoggedInProfile();

    if (!profile) return;

    if (profile.language && profile.language !== language) {
      i18n.changeLanguage(profile.language);
      localStorage.setItem("lang", profile.language);
      onLanguageChange(profile.language);
    }

    if (profile.location && profile.location !== selectedLocation) {
      onLocationChange(profile.location);
    }
  }, []);

  // ✅ Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ Change language + save to profile
  function changeLanguage(lang: "en" | "ta") {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);

    onLanguageChange(lang);

    updateProfilePreferences({
      language: lang,
    });

    setIsLanguageOpen(false);
  }

  // ✅ Change location + save to profile
  function handleLocationChange(location: string) {
    onLocationChange(location);

    updateProfilePreferences({
      location,
    });
  }

  // ✅ Reset category when switching head
  function handleHeadChange(tab: HeadTab) {
    onHeadChange(tab);
    onCategoryChange(DEFAULT_CATEGORY_BY_HEAD[tab]);
  }

  const currentLanguage =
    language === "ta" ? t("common.tamil") : t("common.english");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      {/* TOP SECTION */}
      <div className="relative z-20 border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4 py-4 md:px-6">
          {/* LEFT EMPTY SPACE */}
          <div />

          {/* CENTER LOGO */}
          <div className="text-center">
            <h1 className="flex items-center justify-center">
              <img
                src={Name}
                alt="Just Go Real"
                className="h-20 w-auto object-contain md:h-24"
              />
            </h1>

            <p className="hidden text-xs text-muted-foreground sm:block">
              Local updates that matter
            </p>

            {/* HEAD TABS */}
            <div className="mt-2 hidden items-center justify-center gap-3 text-sm sm:flex">
              <button
                type="button"
                onClick={() => handleHeadChange("news")}
                className={
                  activeHead === "news"
                    ? "font-medium text-accent"
                    : "text-muted-foreground"
                }
              >
                {t("head.news")}
              </button>

              <span>|</span>

              <button
                type="button"
                onClick={() => handleHeadChange("video")}
                className={
                  activeHead === "video"
                    ? "font-medium text-accent"
                    : "text-muted-foreground"
                }
              >
                {t("head.video")}
              </button>

              <span>|</span>

              <button
                type="button"
                onClick={() => handleHeadChange("viral")}
                className={
                  activeHead === "viral"
                    ? "font-medium text-accent"
                    : "text-muted-foreground"
                }
              >
                {t("head.viral")}
              </button>
            </div>
          </div>

          {/* RIGHT CONTROLS */}
          <div className="flex justify-end gap-2">
            {/* LANGUAGE DROPDOWN */}
            <div className="relative" ref={languageRef}>
              <button
                type="button"
                onClick={() => setIsLanguageOpen((value) => !value)}
                className="rounded-md border px-3 py-2 text-sm font-medium"
              >
                🌐 {currentLanguage}
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-md border bg-white shadow">
                  <button
                    type="button"
                    onClick={() => changeLanguage("en")}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    English
                  </button>

                  <button
                    type="button"
                    onClick={() => changeLanguage("ta")}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    தமிழ்
                  </button>
                </div>
              )}
            </div>

            {/* LOCATION */}
            <LocationSelector
              value={selectedLocation}
              onChange={handleLocationChange}
              language={language}
            />
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <Navbar
        activeHead={activeHead}
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
        language={language}
      />
    </header>
  );
}