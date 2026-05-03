import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import BreakingCarousel, { getBreakingNews} from "@/components/BreakingCarousel";
import FloatingAddButton from "@/components/FloatingButton";

import Ads from "../features/Ads";
import LeadNews from "../features/LeadNews";
import NormalNews from "../features/NormalNews";

import { type FeedItem, type NewsPostPayload } from "@/types/news";

const CATEGORY_MAP: Record<string, { en: string; ta: string }> = {
  Politics: { en: "Politics", ta: "அரசியல்" },
  Sports: { en: "Sports", ta: "விளையாட்டு" },
  Technology: { en: "Technology", ta: "தொழில்நுட்பம்" },
  Business: { en: "Business", ta: "வணிகம்" },
  Entertainment: { en: "Entertainment", ta: "பொழுதுபோக்கு" },
  Health: { en: "Health", ta: "ஆரோக்கியம்" },
  Science: { en: "Science", ta: "அறிவியல்" },
  World: { en: "World", ta: "உலகம்" },
  Weather: { en: "Weather", ta: "வானிலை" },
  Local: { en: "Local", ta: "உள்ளூர்" },
  Education: { en: "Education", ta: "கல்வி" },
  Crime: { en: "Crime", ta: "குற்றம்" },
  "Breaking News": { en: "Breaking News", ta: "உடனடி செய்திகள்" },
};

const LOCAL_STORAGE_FEED_KEYS = [
  "jgr_feed_posts",
  "jgr_news_posts",
  "jgr_video_posts",
  "jgr_created_posts",
  "local_news_posts",
];

type Props = {
  news: FeedItem[];
  selectedLocation: string;
  language: "en" | "ta";
  onView: (id: number) => void;
};

type GridItem =
  | {
      kind: "news";
      data: NewsPostPayload;
    }
  | {
      kind: "ad";
    }
  | {
      kind: "empty";
    };

function isFeedItem(value: unknown): value is FeedItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<FeedItem>;

  return (
    typeof item.id === "number" &&
    typeof item.title === "string" &&
    typeof item.category === "string" &&
    typeof item.location === "string" &&
    (item.language === "en" || item.language === "ta") &&
    (item.type === "news" || item.type === "video")
  );
}

function getLocalStoragePosts(): FeedItem[] {
  const posts: FeedItem[] = [];

  for (const key of LOCAL_STORAGE_FEED_KEYS) {
    try {
      const raw = localStorage.getItem(key);

      if (!raw) continue;

      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        posts.push(...parsed.filter(isFeedItem));
      }
    } catch {
      
    }
  }

  return posts;
}

function mergeFeedPosts(seedPosts: FeedItem[], localPosts: FeedItem[]) {
  const map = new Map<number, FeedItem>();

  seedPosts.forEach((item) => {
    map.set(item.id, item);
  });

  localPosts.forEach((item) => {
    map.set(item.id, item);
  });

  return Array.from(map.values()).sort((a, b) => b.id - a.id);
}

export default function NewsHomePage({
  news,
  selectedLocation,
  language,
  onView,
}: Props) {
  const navigate = useNavigate();

  const [localStoragePosts, setLocalStoragePosts] = useState<FeedItem[]>([]);

  function loadLocalStoragePosts() {
    setLocalStoragePosts(getLocalStoragePosts());
  }

  useEffect(() => {
    loadLocalStoragePosts();

    window.addEventListener("focus", loadLocalStoragePosts);
    window.addEventListener("storage", loadLocalStoragePosts);

    return () => {
      window.removeEventListener("focus", loadLocalStoragePosts);
      window.removeEventListener("storage", loadLocalStoragePosts);
    };
  }, []);

  const finalFeed = useMemo(() => {
    return mergeFeedPosts(news, localStoragePosts);
  }, [news, localStoragePosts]);

  const locationFilteredFeed = useMemo(() => {
    if (!selectedLocation || selectedLocation === "All") {
      return finalFeed;
    }

    return finalFeed.filter((item) => item.location === selectedLocation);
  }, [finalFeed, selectedLocation]);

  const breakingNews = useMemo(() => {
    return getBreakingNews(locationFilteredFeed, language);
  }, [locationFilteredFeed, language]);

  const hasBreakingNews = breakingNews.length > 0;

  const filteredNews = useMemo<NewsPostPayload[]>(() => {
    return locationFilteredFeed.filter(
      (item): item is NewsPostPayload =>
        item.type === "news" && item.mediaType === "image"
    );
  }, [locationFilteredFeed]);

  const newsByCategory = useMemo(() => {
    const grouped: Record<string, NewsPostPayload[]> = {};

    filteredNews.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }

      grouped[item.category].push(item);
    });

    Object.keys(grouped).forEach((category) => {
      grouped[category] = grouped[category]
        .sort((a, b) => b.id - a.id)
        .slice(0, 4);
    });

    return grouped;
  }, [filteredNews]);

  const categories = Object.keys(newsByCategory);

  function translateCategory(category: string) {
    return CATEGORY_MAP[category]?.[language] || category;
  }

  return (
    <>
      {/* BREAKING NEWS SECTION */}
      {hasBreakingNews && (
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_300px]">
          <section>
            <BreakingCarousel news={locationFilteredFeed} language={language} />
          </section>

          <aside className="space-y-4 rounded-sm border bg-card p-3">
            <h4 className="font-semibold">
              {language === "ta" ? "⚡ விரைவு தகவல்கள்" : "⚡ Quick Alerts"}
            </h4>

            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>
                {language === "ta"
                  ? "🚧 டி நகர் அருகே சாலை மூடப்பட்டது"
                  : "🚧 Road closed near T Nagar"}
              </li>

              <li>
                {language === "ta"
                  ? "🚦 கிண்டி பகுதியில் போக்குவரத்து நெரிசல்"
                  : "🚦 Traffic heavy in Guindy"}
              </li>

              <li>
                {language === "ta"
                  ? "🌧 மாலை மழை வாய்ப்பு"
                  : "🌧 Rain expected in evening"}
              </li>
            </ul>

            <h4 className="mt-4 font-semibold">
              {language === "ta" ? "🔥 பிரபலமானவை" : "🔥 Trending"}
            </h4>

            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>#ChennaiRains</li>
              <li>#MetroUpdate</li>
              <li>#TrafficAlert</li>
            </ul>
          </aside>
        </div>
      )}

      {/* CATEGORY NEWS SECTIONS */}
      {categories.map((category) => {
        const categoryNews = newsByCategory[category];

        if (!categoryNews?.length) return null;

        const lead = categoryNews[0];
        const normalNews = categoryNews.slice(1, 4);

        const sideItems: GridItem[] = [
          normalNews[0]
            ? {
                kind: "news",
                data: normalNews[0],
              }
            : {
                kind: "empty",
              },

          {
            kind: "ad",
          },

          normalNews[1]
            ? {
                kind: "news",
                data: normalNews[1],
              }
            : {
                kind: "empty",
              },

          normalNews[2]
            ? {
                kind: "news",
                data: normalNews[2],
              }
            : {
                kind: "empty",
              },
        ];

        return (
          <section key={category} className="mt-10">
            <h2 className="text-2xl font-bold">
              {translateCategory(category)}
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-[0.7fr_1fr]">
              {/* LEFT SIDE: LEAD NEWS */}
              <LeadNews
                item={lead}
                onClick={() => {
                  onView(lead.id);
                  navigate(`/news/${lead.id}`);
                }}
              />

              {/* RIGHT SIDE FIXED SLOTS */}
              <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2">
                {sideItems.map((item, index) => {
                  if (item.kind === "ad") {
                    return (
                      <div
                        key={`ad-${category}-${index}`}
                        className="self-start"
                      >
                        <Ads />
                      </div>
                    );
                  }

                  if (item.kind === "empty") {
                    return (
                      <div
                        key={`empty-${category}-${index}`}
                        className="invisible h-[260px] rounded-sm border border-transparent"
                      />
                    );
                  }

                  return (
                    <div key={item.data.id} className="self-start">
                      <NormalNews
                        item={item.data}
                        onClick={() => {
                          onView(item.data.id);
                          navigate(`/news/${item.data.id}`);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      <FloatingAddButton
        label={language === "ta" ? "செய்தி சேர்" : "Add News"}
        route="/create-news"
      />
    </>
  );
}