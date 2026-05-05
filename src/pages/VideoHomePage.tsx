import { useEffect, useMemo, useRef, useState } from "react";
import type { SyntheticEvent } from "react";
import FloatingAddButton from "@/components/FloatingButton";
import NewsButton from "@/features/NewsButton";
import ImageAd from "@/components/ImageAd";
import logo from "@/assets/logo.png";
import { getTimeAgo } from "@/helper/getTimeAgo";
import { type VideoPostPayload } from "@/types/news";

type Props = {
  videos: VideoPostPayload[];
};

const topAds = [
  "/ads/consdroid-video-top.webp",
  "/ads/isha-video-top.webp",
  "/ads/knowtran-video-top.webp",
  "/ads/talky-video-top.webp",
  "/ads/truprops-video-top.webp"
];

const bottomAds = [
  "/ads/knowtran-video-bottom.webp",
  "/ads/truprops-video-bottom.webp",
  "/ads/consdroid-video-bottom.webp",
  "/ads/isha-video-bottom.webp",
  "/ads/talky-video-bottom.webp",
];

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

        <FloatingAddButton label="Add Video" route="/create-video" />
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
          <ImageAd
            ads={topAds}
            label="Video page top advertisement"
            size="large"
            priority
          />

          <ImageAd
            ads={bottomAds}
            label="Video page bottom advertisement"
            size="medium"
          />
        </div>
      </div>
    </section>
  );
}