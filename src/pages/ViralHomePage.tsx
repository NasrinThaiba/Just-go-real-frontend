import { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NewsButton from "@/features/NewsButton";
import ImageAd from "@/components/ImageAd";
import logo from "@/assets/logo.png";
import type { NewsPostPayload } from "@/types/news";
import { getTimeAgo } from "@/helper/getTimeAgo";

type Props = {
  viral: NewsPostPayload[];
  activeCategory: string;
  onView: (id: number) => void;
  language: "en" | "ta";
};

const topAds = [
  "/ads/consdroid-viral-top.webp",
  "/ads/isha-viral-top.webp",
  "/ads/knowtran-viral-top.webp",
  "/ads/talky-viral-top.webp",
  "/ads/truprops-video-top.webp"
];
const bottomAds = [
  "/ads/truprops-video-bottom.webp",
  "/ads/consdroid-viral-bottom.webp",
  "/ads/talky-viral-bottom.webp",
  "/ads/knowtran-viral-bottom.webp",
  "/ads/isha-viral-bottom.webp",
];

function isViralCategory(category: string) {
  return category.trim().toLowerCase() === "viral";
}

function getSessionViews(postId: number, fallbackViews: number) {
  try {
    const raw = sessionStorage.getItem("news_views");

    if (!raw) return fallbackViews;

    const viewMap = JSON.parse(raw) as Record<string, number>;

    return viewMap[String(postId)] ?? fallbackViews;
  } catch {
    return fallbackViews;
  }
}

function getCategoryLabel(
  t: ReturnType<typeof useTranslation>["t"],
  activeCategory: string
) {
  const mainKey = `navbar.viral.main.${activeCategory}`;
  const moreKey = `navbar.viral.more.${activeCategory}`;

  const mainLabel = t(mainKey);

  if (mainLabel !== mainKey) {
    return mainLabel;
  }

  const moreLabel = t(moreKey);

  if (moreLabel !== moreKey) {
    return moreLabel;
  }

  return activeCategory
    .replace(/([A-Z])/g, " $1")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

export default function ViralHomePage({
  viral,
  activeCategory,
  onView,
  language,
}: Props) {
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [i18n, language]);

  const displayPosts = useMemo(() => {
    const postsWithLatestViews = viral.map((item) => ({
      ...item,
      views: getSessionViews(item.id, item.views || 0),
    }));

    const viralCategoryPosts = postsWithLatestViews.filter((item) =>
      isViralCategory(item.category)
    );

    const source =
      viralCategoryPosts.length > 0 ? viralCategoryPosts : postsWithLatestViews;

    return [...source]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 10);
  }, [viral]);

  if (displayPosts.length === 0) {
    return (
      <section className="mt-6">
        <div className="rounded-xl border border-border bg-card p-10 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-foreground">{t("head.viral")}</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {language === "ta"
              ? "இப்போது வைரல் பதிவுகள் இல்லை."
              : "No viral posts available right now."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-6">
      <div className="ml-3 mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {getCategoryLabel(t, activeCategory)}
          </h2>
        </div>

        <span className="text-sm text-muted-foreground">
          {language === "ta" ? "வைரல் முகப்பு" : "Viral Home"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[65%_30%] gap-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 pl-5">
          {displayPosts.map((item, index) => (
            <article
              key={item.id}
              onClick={() => {
                onView(item.id);
                navigate(`/news/${item.id}`);
              }}
              className="flex h-full min-h-[430px] cursor-pointer flex-col overflow-hidden rounded-sm border border-border bg-card shadow-sm transition hover:scale-[1.01]"
            >
              <div className="h-[250px] w-full shrink-0 bg-muted sm:h-[320px] md:h-[400px]">
                {item.mediaUrl ? (
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                    No image available
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                    {item.views} views
                  </span>

                  <span className="text-xs text-muted-foreground">
                    #{index + 1}
                  </span>
                </div>

                <h3 className="line-clamp-2 font-semibold leading-6 text-foreground">
                  {item.title}
                </h3>

                <div
                  className="mt-auto pt-3"
                  onClick={(event) => event.stopPropagation()}
                >
                  <NewsButton
                    postId={item.id}
                    name={item.author.name}
                    time={getTimeAgo(item.createdAt)}
                    logo={item.author.avatar || logo}
                    views={item.views}
                    initialLikedCount={item.likes}
                    initialCommentCount={item.comments.length}
                    initialShareCount={item.shares}
                    initialComments={item.comments}
                    showCommentList={false}
                    shareTitle={item.title}
                    shareUrl={`${window.location.origin}/news/${item.id}`}
                    onLike={(liked) => console.log(liked)}
                    onComment={(comment) => console.log(comment)}
                    onShare={() => console.log("shared")}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* VIRAL PAGE ADS */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 flex flex-col gap-6">
            <ImageAd
              ads={topAds}
              label="Viral page top advertisement"
              size="large"
              priority
            />

            <ImageAd
              ads={bottomAds}
              label="Viral page bottom advertisement"
              size="medium"
            />
          </div>
        </aside>
      </div>
    </section>
  );
}