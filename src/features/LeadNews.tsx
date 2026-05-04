import React, { useEffect, useState } from "react";

import NewsButton from "./NewsButton";

import { type FeedItem, type NewsPostPayload } from "../types/news";
import { getTimeAgo } from "@/helper/getTimeAgo";

type Props = {
  item: NewsPostPayload;
  onClick?: () => void;
};

const FEED_STORAGE_KEYS = [
  "jgr_feed_posts",
  "jgr_news_posts",
  "jgr_video_posts",
  "jgr_created_posts",
  "local_news_posts",
];

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

function saveSessionViews(postId: number, views: number) {
  try {
    const raw = sessionStorage.getItem("news_views");
    const viewMap = raw ? (JSON.parse(raw) as Record<string, number>) : {};

    sessionStorage.setItem(
      "news_views",
      JSON.stringify({
        ...viewMap,
        [postId]: views,
      })
    );
  } catch {
    // ignore storage errors
  }
}

function updateViewsInsideLocalStorage(postId: number, views: number) {
  for (const key of FEED_STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(key);

      if (!raw) continue;

      const posts = JSON.parse(raw) as FeedItem[];

      if (!Array.isArray(posts)) continue;

      let changed = false;

      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          changed = true;

          return {
            ...post,
            views,
          };
        }

        return post;
      });

      if (changed) {
        localStorage.setItem(key, JSON.stringify(updatedPosts));
      }
    } catch {
      // ignore invalid localStorage data
    }
  }
}

const LeadNews: React.FC<Props> = ({ item, onClick }) => {
  const [views, setViews] = useState(() =>
    getSessionViews(item.id, item.views || 0)
  );

  useEffect(() => {
    setViews(getSessionViews(item.id, item.views || 0));
  }, [item.id, item.views]);

  function handleArticleClick() {
    const nextViews = views + 1;

    setViews(nextViews);
    saveSessionViews(item.id, nextViews);
    updateViewsInsideLocalStorage(item.id, nextViews);

    onClick?.();
  }

  return (
    <article
      onClick={handleArticleClick}
      className="flex h-full cursor-pointer flex-col overflow-hidden transition hover:scale-[1.01]"
    >
      <div className="h-[200px] w-full overflow-hidden sm:h-[200px] md:h-[250px] lg:h-[300px]">
        {item.mediaUrl ? (
          <img
            src={item.mediaUrl}
            alt={item.title}
            className="h-full w-full rounded-sm object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-sm bg-muted text-sm text-muted-foreground">
            No image available
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <h3 className="line-clamp-2 text-[15px] font-bold text-foreground sm:text-[18px] md:text-[20px]">
          {item.title}
        </h3>

        <p className="mt-3 line-clamp-6 break-all text-[13px] leading-7 text-muted-foreground sm:text-[14px] md:text-[16px]">
          {item.description}
        </p>

        <div
          className="mt-auto pb-3 pt-2"
          onClick={(event) => event.stopPropagation()}
        >
          <NewsButton
  postId={item.id}
  name={item.author.name}
  time={getTimeAgo(item.createdAt)}
  logo={item.author.avatar}
  views={views}
  initialLikedCount={item.likes}
  initialCommentCount={item.comments.length}
  initialShareCount={item.shares}
  initialComments={item.comments}
  showCommentList={false}
  shareTitle={item.title}
  shareUrl={`${window.location.origin}/news/${item.id}`}
/>
        </div>
      </div>
    </article>
  );
};

export default LeadNews;