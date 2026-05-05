import ImageAd from "@/components/ImageAd";

const consdroidAd = "/ads/consdroid-home.webp";
const ishaAd = "/ads/isha-home.webp";
const knowtranAd = "/ads/knowtron-home.webp";
const talkyAd = "/ads/talky-home.webp";
const trupropsAd = "/ads/truprops-home.webp";

type AdsProps = {
  category?: string;
};

function normalizeCategory(category?: string) {
  return category?.trim().toLowerCase() || "default";
}

const categoryAds: Record<string, string[]> = {
  local: [consdroidAd],
  politics: [ishaAd],
  crime: [talkyAd],
  sports: [knowtranAd],
  entertainment: [talkyAd],
  business: [trupropsAd],
  education: [knowtranAd],
  weather: [ishaAd],
  technology: [knowtranAd],
  health: [consdroidAd],
  science: [knowtranAd],
  viral: [talkyAd],
  default: [consdroidAd],
};

export default function Ads({ category }: AdsProps) {
  const normalizedCategory = normalizeCategory(category);
  const ads = categoryAds[normalizedCategory] ?? categoryAds.default;

  return (
    <ImageAd
      key={`ad-${normalizedCategory}`}
      ads={ads}
      label={`${category || "Home"} advertisement`}
      size="home"
      className="group h-[220px] w-full sm:h-[240px] md:h-[260px]"
    />
  );
}