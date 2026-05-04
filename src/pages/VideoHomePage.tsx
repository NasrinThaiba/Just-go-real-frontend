import { useEffect, useMemo, useRef, useState } from "react";
import type { SyntheticEvent } from "react";
import { X } from "lucide-react";

import FloatingAddButton from "@/components/FloatingButton";
import NewsButton from "@/features/NewsButton";
import logo from "@/assets/logo.png";
import { getTimeAgo } from "@/helper/getTimeAgo";
import { type VideoPostPayload } from "@/types/news";

import Top1 from "../ads/consdroid-video-top.png";
import Top2 from "../ads/isha-video-top.png";
import Top3 from "../ads/knowtran-video-top.png";
import Top4 from "../ads/talky-video-top.png";
import Top5 from "../ads/truprops-video-top.png";

import bottom5 from "../ads/consdroid-video-bottom.png";
import bottom3 from "../ads/isha-video-bottom.png";
import bottom4 from "../ads/knowtran-video-bottom.png";
import bottom2 from "../ads/talky-video-bottom.png";
import bottom1 from "../ads/truprops-video-bottom.png";

type Props = {
  videos: VideoPostPayload[];
};

type VideoAdProps = {
  ads: string[];
  label: string;
  size: "large" | "medium";
};

const topAds = [Top1, Top2, Top3, Top4, Top5];
const bottomAds = [bottom1, bottom2, bottom3, bottom4, bottom5];

const LOCAL_STORAGE_FEED_KEYS = [
  "jgr_feed_posts",
  "jgr_news_posts",
  "jgr_video_posts",
  "jgr_created_posts",
  "local_news_posts",
];

function isVideoPost(value: unknown): value is VideoPostPayload {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<VideoPostPayload>;

  return (
    typeof item.id === "number" &&
    item.type === "video" &&
    item.mediaType === "video" &&
    typeof item.title === "string" &&
    typeof item.category === "string" &&
    typeof item.location === "string" &&
    (item.language === "en" || item.language === "ta") &&
    (item.videoSource === "upload" || item.videoSource === "youtube") &&
    typeof item.mediaUrl === "string"
  );
}

function getLocalStorageVideos(): VideoPostPayload[] {
  const videos: VideoPostPayload[] = [];

  for (const key of LOCAL_STORAGE_FEED_KEYS) {
    try {
      const raw = localStorage.getItem(key);

      if (!raw) continue;

      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        videos.push(...parsed.filter(isVideoPost));
      }
    } catch {
      // Ignore invalid localStorage data
    }
  }

  return videos;
}

function mergeVideos(
  staticVideos: VideoPostPayload[],
  localVideos: VideoPostPayload[]
) {
  const map = new Map<number, VideoPostPayload>();

  staticVideos.forEach((item) => {
    map.set(item.id, item);
  });

  localVideos.forEach((item) => {
    map.set(item.id, item);
  });

  return Array.from(map.values()).sort((a, b) => b.id - a.id);
}

function updateVideoViewsInLocalStorage(videoId: number, nextViews: number) {
  for (const key of LOCAL_STORAGE_FEED_KEYS) {
    try {
      const raw = localStorage.getItem(key);

      if (!raw) continue;

      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) continue;

      let changed = false;

      const updatedPosts = parsed.map((post) => {
        if (isVideoPost(post) && post.id === videoId) {
          changed = true;

          return {
            ...post,
            views: nextViews,
          };
        }

        return post;
      });

      if (changed) {
        localStorage.setItem(key, JSON.stringify(updatedPosts));
      }
    } catch {
      // Ignore invalid localStorage data
    }
  }
}

function getYoutubeSrc(mediaUrl: string) {
  const separator = mediaUrl.includes("?") ? "&" : "?";

  return `${mediaUrl}${separator}enablejsapi=1`;
}

function VideoAd({ ads, label, size }: VideoAdProps) {
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
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden border bg-gray-100 ${sizeClass}`}
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

          <a
            href="#"
            aria-label={label}
            className="block h-full w-full"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              key={currentAd}
              src={currentAd}
              alt={label}
              className="h-full w-full object-cover transition duration-500 hover:scale-105"
            />
          </a>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Advertisement closed</p>
      )}
    </div>
  );
}

export default function VideoHomePage({ videos }: Props) {
  const [localVideos, setLocalVideos] = useState<VideoPostPayload[]>([]);
  const [viewCounts, setViewCounts] = useState<Record<number, number>>({});

  const playersRef = useRef<Record<number, any>>({});
  const timersRef = useRef<Record<number, number>>({});
  const countedVideoIdsRef = useRef<Set<number>>(new Set());

  function loadLocalVideos() {
    setLocalVideos(getLocalStorageVideos());
  }

  useEffect(() => {
    loadLocalVideos();

    window.addEventListener("focus", loadLocalVideos);
    window.addEventListener("storage", loadLocalVideos);

    return () => {
      window.removeEventListener("focus", loadLocalVideos);
      window.removeEventListener("storage", loadLocalVideos);
    };
  }, []);

  const videoList = useMemo(() => {
    return mergeVideos(videos, localVideos).map((video) => ({
      ...video,
      views: viewCounts[video.id] ?? video.views,
    }));
  }, [videos, localVideos, viewCounts]);

  useEffect(() => {
    if ((window as any).YT) return;

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  }, []);

  function increaseView(videoId: number) {
    if (countedVideoIdsRef.current.has(videoId)) return;

    countedVideoIdsRef.current.add(videoId);

    const currentVideo = videoList.find((video) => video.id === videoId);
    const currentViews = viewCounts[videoId] ?? currentVideo?.views ?? 0;
    const nextViews = currentViews + 1;

    setViewCounts((current) => ({
      ...current,
      [videoId]: nextViews,
    }));

    updateVideoViewsInLocalStorage(videoId, nextViews);
    setLocalVideos(getLocalStorageVideos());
  }

  const handleVideoPlay =
    (videoId: number) => (event: SyntheticEvent<HTMLVideoElement>) => {
      const videoElement = event.currentTarget;

      window.clearTimeout(timersRef.current[videoId]);

      timersRef.current[videoId] = window.setTimeout(() => {
        if (!videoElement.paused) {
          increaseView(videoId);
        }
      }, 3000);

      videoElement.onpause = () => {
        window.clearTimeout(timersRef.current[videoId]);
      };

      videoElement.onended = () => {
        window.clearTimeout(timersRef.current[videoId]);
      };
    };

  function setupYouTubePlayer(videoId: number, iframeId: string) {
    const YT = (window as any).YT;

    if (!YT || !YT.Player) {
      window.setTimeout(() => setupYouTubePlayer(videoId, iframeId), 500);
      return;
    }

    if (playersRef.current[videoId]) return;

    const player = new YT.Player(iframeId, {
      events: {
        onStateChange: (event: any) => {
          if (event.data === YT.PlayerState.PLAYING) {
            window.clearTimeout(timersRef.current[videoId]);

            timersRef.current[videoId] = window.setTimeout(() => {
              if (player.getPlayerState() === YT.PlayerState.PLAYING) {
                increaseView(videoId);
              }
            }, 3000);
          }

          if (
            event.data === YT.PlayerState.PAUSED ||
            event.data === YT.PlayerState.ENDED ||
            event.data === YT.PlayerState.BUFFERING
          ) {
            window.clearTimeout(timersRef.current[videoId]);
          }
        },
      },
    });

    playersRef.current[videoId] = player;
  }

  if (!videoList || videoList.length === 0) {
    return (
      <section className="mt-10 text-center">
        <p className="text-muted-foreground">No videos available</p>
      </section>
    );
  }

  return (
    <section className="mt-10 max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[60%_30%] gap-15">
        <div className="space-y-12">
          {videoList.map((video) => {
            const isYoutube = video.videoSource === "youtube";

            return (
              <div key={video.id} className="border-b pl-15 pb-10">
                <div className="aspect-video rounded-sm overflow-hidden shadow-sm">
                  {isYoutube ? (
                    <iframe
                      id={`yt-${video.id}`}
                      src={getYoutubeSrc(video.mediaUrl)}
                      title={video.title}
                      className="w-full h-full"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      onLoad={() =>
                        setupYouTubePlayer(video.id, `yt-${video.id}`)
                      }
                    />
                  ) : (
                    <video
                      src={video.mediaUrl}
                      controls
                      className="w-full h-full object-cover"
                      onPlay={handleVideoPlay(video.id)}
                    />
                  )}
                </div>

                <h3 className="mt-4 text-lg font-semibold">{video.title}</h3>

                <div className="mt-3">
                  <NewsButton
                    postId={video.id}
                    name={video.author.name || "News Tamil"}
                    time={getTimeAgo(video.createdAt)}
                    logo={video.author.avatar || logo}
                    views={video.views || 0}
                    initialLikedCount={video.likes || 0}
                    initialCommentCount={video.comments?.length || 0}
                    initialShareCount={video.shares || 0}
                    initialComments={video.comments || []}
                    showCommentList={true}
                    shareTitle={video.title}
                    shareUrl={`${window.location.origin}/video/${video.id}`}
                  />
                </div>
              </div>
            );
          })}

          <FloatingAddButton label="Add Video" route="/create-video" />
        </div>

        <div className="hidden lg:flex flex-col gap-6 sticky top-24">
          <VideoAd
            ads={topAds}
            label="Video page top advertisement"
            size="large"
          />

          <VideoAd
            ads={bottomAds}
            label="Video page bottom advertisement"
            size="medium"
          />
        </div>
      </div>
    </section>
  );
}