import { useEffect, useMemo, useRef, useState } from "react";

type Language = "en" | "ta";

type Props = {
  value: string;
  onChange: (location: string) => void;
  language: Language;
};

const LOCATION_MAP = {
  All: { en: "All", ta: "அனைத்து இடங்கள்" },
  Tenkasi: { en: "Tenkasi", ta: "தென்காசி" },
  Chennai: { en: "Chennai", ta: "சென்னை" },
  Coimbatore: { en: "Coimbatore", ta: "கோயம்புத்தூர்" },
  Madurai: { en: "Madurai", ta: "மதுரை" },
  Trichy: { en: "Trichy", ta: "திருச்சி" },
} as const;

export default function LocationSelector({
  value,
  onChange,
  language,
}: Props): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // sync input (show translated label)
  useEffect(() => {
    const label =
      LOCATION_MAP[value as keyof typeof LOCATION_MAP]?.[language] || value;

    setQuery(label);
  }, [value, language]);

  // load saved location (KEY ONLY)
  useEffect(() => {
    const saved = localStorage.getItem("selectedLocation");
    if (saved) onChange(saved);
  }, [onChange]);

  // close outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  // filter (based on language)
  const filtered = useMemo(() => {
    return Object.keys(LOCATION_MAP).filter((key) => {
      const label =
        LOCATION_MAP[key as keyof typeof LOCATION_MAP][language];

      return label.toLowerCase().includes(query.toLowerCase());
    });
  }, [query, language]);

  // ✅ SELECT (STORE KEY ONLY)
  const handleSelect = (key: string) => {
    const label =
      LOCATION_MAP[key as keyof typeof LOCATION_MAP][language];

    setQuery(label);
    setIsOpen(false);

    localStorage.setItem("selectedLocation", key); // ✅ KEY
    onChange(key); // ✅ KEY
  };

  return (
    <div ref={wrapperRef} className="relative">

      {/* BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="border px-3 py-2 rounded-md text-sm flex items-center gap-1 hover:bg-gray-100"
      >
        📍{" "}
        {LOCATION_MAP[value as keyof typeof LOCATION_MAP]?.[language] ||
          (language === "ta" ? "இடம்" : "Location")}{" "}
        ▾
      </button>

      {/* DROPDOWN */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow z-50">

          {/* SEARCH */}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === "ta"
                ? "இடம் தேடுக..."
                : "Search location..."
            }
            className="w-full p-2 border-b outline-none text-sm"
          />

          {/* LIST */}
          <div className="max-h-60 overflow-y-auto">
            {filtered.map((key) => {
              const label =
                LOCATION_MAP[key as keyof typeof LOCATION_MAP][language];

              return (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}