import React, { useEffect, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useNavigate } from "react-router-dom";

import { type FeedItem } from "@/types/news";

type Props = {
  news: FeedItem[];
  language: "en" | "ta";
};

export function getBreakingNews(news: FeedItem[], language: "en" | "ta") {
  let filtered = news.filter(
    (item) => item.category === "Breaking News" && item.language === language
  );

  if (filtered.length === 0) {
    filtered = news.filter((item) => item.category === "Breaking News");
  }

  return filtered.slice(0, 5);
}

const BreakingCarousel: React.FC<Props> = ({ news = [], language }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const navigate = useNavigate();

  const breakingNews = useMemo(() => {
    return getBreakingNews(news, language);
  }, [news, language]);

  useEffect(() => {
    if (!emblaApi || breakingNews.length <= 1) return;

    const interval = window.setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);

    return () => window.clearInterval(interval);
  }, [emblaApi, breakingNews.length]);

  const breakingLabel = language === "ta" ? "உடனடி செய்திகள்" : "BREAKING";

  // ✅ No breaking news means no carousel at all
  if (!breakingNews.length) {
    return null;
  }

  return (
    <div className="relative">
      {/* LABEL */}
      <div className="mb-2 text-xs font-semibold text-red-500">
        🔴 {breakingLabel}
      </div>

      {/* CAROUSEL */}
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {breakingNews.map((item) => {
            const isVideo = item.type === "video";

            return (
              <div
                key={item.id}
                className="relative min-w-full cursor-pointer"
                onClick={() =>
                  navigate(
                    item.type === "video"
                      ? `/video/${item.id}`
                      : `/news/${item.id}`
                  )
                }
              >
                {isVideo ? (
                  item.videoSource === "youtube" ? (
                    <iframe
                      src={`${item.mediaUrl}?autoplay=1&mute=1`}
                      title={item.title}
                      className="h-48 w-full md:h-64"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={item.mediaUrl}
                      className="h-48 w-full object-cover md:h-64"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  )
                ) : (
                  <img
                    src={item.mediaUrl || "/fallback.jpg"}
                    alt={item.title}
                    className="h-48 w-full object-cover md:h-64"
                  />
                )}

                {/* OVERLAY */}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BUTTONS */}
      {breakingNews.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded bg-black/50 px-2 py-1 text-white"
          >
            ◀
          </button>

          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-black/50 px-2 py-1 text-white"
          >
            ▶
          </button>
        </>
      )}
    </div>
  );
};

export default BreakingCarousel;