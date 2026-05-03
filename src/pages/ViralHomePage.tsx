import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

import NewsButton from "@/features/NewsButton";
import logo from "@/assets/logo.png";
import type { NewsPostPayload } from "@/types/news";
import { getTimeAgo } from "@/helper/getTimeAgo";

import Top1 from "../ads/consdroid-viral-top.png";
import Top2 from "../ads/isha-viral-top.png";
import Top3 from "../ads/knowtran-viral-top.png";
import Top4 from "../ads/talky-viral-top.png";
import Top5 from "../ads/truprops-video-top.png";

import bottom5 from "../ads/consdroid-viral-bottom.png";
import bottom4 from "../ads/isha-viral-bottom.png";
import bottom3 from "../ads/knowtran-viral-bottom.png";
import bottom1 from "../ads/talky-viral-bottom.png";
import bottom2 from "../ads/truprops-video-bottom.png";

type Props = {
  viral: NewsPostPayload[];
  activeCategory: string;
  onView: (id: number) => void;
};

type ViralAdProps = {
  ads: string[];
  label: string;
  size: "large" | "medium";
};

const topAds = [Top1, Top2, Top3, Top4, Top5];
const bottomAds = [bottom1, bottom2, bottom3, bottom4, bottom5];

function formatCategoryLabel(value: string) {
  if (value === "Home" || value === "All") return "Viral News";

  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function ViralAd({ ads, label, size }: ViralAdProps) {
  const [adIndex, setAdIndex] = useState(0);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    if (isClosed) return;

    const interval = window.setInterval(() => {
      setAdIndex((currentIndex) => (currentIndex + 1) % ads.length);
    }, 10000);

    return () => {
      window.clearInterval(interval);
    };
  }, [ads.length, isClosed]);

  const currentAd = ads[adIndex];
  const sizeClass = size === "large" ? "h-[300px]" : "h-[250px]";

  return (
    <article
      className={`relative w-full overflow-hidden border border-border bg-card shadow-sm ${sizeClass}`}
    >
      {!isClosed ? (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsClosed(true);
            }}
            className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white shadow-md transition hover:bg-red-600"
            aria-label="Close advertisement"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="absolute left-3 top-3 z-10 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            Ad
          </div>

          <a href="#" aria-label={label} className="block h-full w-full">
            <img
              key={currentAd}
              src={currentAd}
              alt={label}
              className="h-full w-full object-cover transition duration-500 hover:scale-105"
            />
          </a>
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs font-semibold text-slate-400">
          Advertisement closed
        </div>
      )}
    </article>
  );
}

export default function ViralHomePage({
  viral,
  activeCategory,
  onView,
}: Props) {
  const navigate = useNavigate();

  if (viral.length === 0) {
    return (
      <section className="mt-6">
        <div className="rounded-xl border border-border bg-card p-10 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-foreground">Viral</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            No viral posts available right now.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {formatCategoryLabel(activeCategory)}
          </h2>
        </div>

        <span className="text-sm text-muted-foreground">Viral Home</span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[65%_30%]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {viral.map((item, index) => (
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
                    name={item.author.name}
                    time={getTimeAgo(item.createdAt)}
                    logo={item.author.avatar || logo}
                    views={item.views}
                    initialLikedCount={item.likes}
                    initialCommentCount={item.comments.length}
                    initialShareCount={item.shares}
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
            <ViralAd
              ads={topAds}
              label="Viral page top advertisement"
              size="large"
            />

            <ViralAd
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