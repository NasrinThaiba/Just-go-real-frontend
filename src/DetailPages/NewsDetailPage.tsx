import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "@/pages/MainLayout";
import NewsButton from "@/features/NewsButton";
import ImageAd from "@/components/ImageAd";
import { DEFAULT_CATEGORY_BY_HEAD, type HeadTab } from "@/pages/Navbar";
import { newsData } from "../data/newsData";
import logo from "../assets/logo.png";
import { getTimeAgo } from "@/helper/getTimeAgo";
import { getStoredFeedPosts } from "@/utils/feedStorage";
import { getCurrentAuthor } from "@/helper/getCurrentAuthor";
import { getStoredComments, savePostComment } from "@/utils/commentStorage";

import type { NewsPostPayload, PostAuthor, PostComment } from "@/types/news";

const topAds = [
  "/ads/consdroid-video-top.webp",
  "/ads/isha-video-top.webp",
  "/ads/knowtran-video-top.webp",
  "/ads/talky-video-top.webp",
  "/ads/truprops-video-top.webp",
];

const bottomAds = [
  "/ads/truprops-video-bottom.webp",
  "/ads/knowtran-video-bottom.webp",
  "/ads/talky-video-bottom.webp",
  "/ads/isha-video-bottom.webp",
  "/ads/consdroid-video-bottom.webp",
];

function formatDescription(text?: string) {
  if (!text) return ["No description available"];

  if (text.includes("\n")) {
    return text
      .split(/\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }

  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const paragraphs: string[] = [];

  for (let index = 0; index < sentences.length; index += 3) {
    paragraphs.push(sentences.slice(index, index + 3).join(" "));
  }

  return paragraphs;
}

function mergeComments(
  staticComments: PostComment[],
  storedComments: PostComment[]
) {
  const map = new Map<number, PostComment>();

  staticComments.forEach((comment) => {
    map.set(comment.id, comment);
  });

  storedComments.forEach((comment) => {
    map.set(comment.id, comment);
  });

  return Array.from(map.values()).sort((a, b) => b.id - a.id);
}

function formatCommentTime(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStoredViewMap() {
  try {
    const storedViews = sessionStorage.getItem("news_views");

    if (!storedViews) return {};

    return JSON.parse(storedViews) as Record<string, number>;
  } catch {
    return {};
  }
}

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentAuthor = useMemo<PostAuthor>(() => getCurrentAuthor(), []);

  const [activeHead, setActiveHead] = useState<HeadTab>("news");
  const [activeCategory, setActiveCategory] = useState<string>(
    DEFAULT_CATEGORY_BY_HEAD.news
  );
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [language, setLanguage] = useState<"en" | "ta">("en");

  const newsItem = useMemo<NewsPostPayload | undefined>(() => {
    const postId = Number(id);

    const storedPosts = getStoredFeedPosts();
    const viewMap = getStoredViewMap();

    const allPosts = [...storedPosts, ...newsData].map((item) => ({
      ...item,
      views: viewMap[String(item.id)] ?? item.views ?? 0,
    }));

    return allPosts.find(
      (item): item is NewsPostPayload =>
        item.id === postId && item.type === "news"
    );
  }, [id]);

  const [views, setViews] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);

  const commentsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!newsItem) return;

    const viewMap = getStoredViewMap();
    const initialViews = viewMap[String(newsItem.id)] ?? newsItem.views ?? 0;

    setViews(initialViews);
  }, [newsItem]);

  useEffect(() => {
    if (!newsItem) return;

    const storedComments = getStoredComments(newsItem.id);

    setComments(mergeComments(newsItem.comments ?? [], storedComments));
  }, [newsItem]);

  function scrollToComments() {
    requestAnimationFrame(() => {
      commentsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function refreshCommentsFromStorage() {
    if (!newsItem) return;

    const storedComments = getStoredComments(newsItem.id);

    setComments(mergeComments(newsItem.comments ?? [], storedComments));
  }

  function handleNewsButtonComment() {
    refreshCommentsFromStorage();
    setShowComments(true);
    scrollToComments();
  }

  function handleAddComment() {
    if (!newsItem) return;

    const trimmed = commentText.trim();

    if (!trimmed) return;

    const newComment: PostComment = {
      id: Date.now(),
      userName: currentAuthor.name || "User",
      createdAt: new Date().toISOString(),
      text: trimmed,
    };

    const updatedComments = [newComment, ...comments];

    setComments(updatedComments);
    savePostComment(newsItem.id, newComment);

    setCommentText("");
    setShowComments(true);
  }

  if (!newsItem) {
    return (
      <MainLayout
        activeHead={activeHead}
        activeCategory={activeCategory}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        language={language}
        onLanguageChange={setLanguage}
        onHeadChange={setActiveHead}
        onCategoryChange={setActiveCategory}
      >
        <div className="py-10">
          <h1 className="text-2xl font-bold">News not found</h1>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Go Back
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      activeHead={activeHead}
      activeCategory={activeCategory}
      selectedLocation={selectedLocation}
      onLocationChange={setSelectedLocation}
      language={language}
      onLanguageChange={setLanguage}
      onHeadChange={setActiveHead}
      onCategoryChange={setActiveCategory}
    >
      <section className="mx-auto mt-10 max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="min-w-0">
            <h1 className="text-2xl font-black leading-tight text-foreground md:text-3xl">
              {newsItem.title}
            </h1>

            {newsItem.mediaUrl && (
              <div className="mt-6 overflow-hidden rounded-sm bg-muted shadow-sm">
                <img
                  src={newsItem.mediaUrl}
                  alt={newsItem.title}
                  className="max-h-[420px] w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
            )}

            <div className="border-b border-border py-4">
              <NewsButton
                postId={newsItem.id}
                name={newsItem.author.name}
                time={getTimeAgo(newsItem.createdAt)}
                logo={newsItem.author.avatar || logo}
                views={views}
                initialLikedCount={newsItem.likes}
                initialCommentCount={comments.length}
                initialShareCount={newsItem.shares}
                initialComments={comments}
                showCommentList={false}
                shareTitle={newsItem.title}
                shareUrl={`${window.location.origin}/news/${newsItem.id}`}
                onLike={(liked) => console.log(liked)}
                onComment={handleNewsButtonComment}
                onShare={() => console.log("shared")}
              />
            </div>

            <div className="mt-8 space-y-5">
              {formatDescription(newsItem.description || "").map(
                (paragraph, index) => (
                  <p
                    key={index}
                    className="whitespace-pre-line text-base leading-6 text-muted-foreground md:text-md"
                  >
                    {paragraph.trim()}
                  </p>
                )
              )}
            </div>

            <section
              ref={commentsRef}
              className="mt-10 rounded-sm border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-card-foreground">
                  Comments ({comments.length})
                </h2>

                <button
                  type="button"
                  onClick={() => setShowComments((value) => !value)}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  {showComments ? "Hide" : "Show"}
                </button>
              </div>

              {showComments && (
                <>
                  <div className="mt-4 flex gap-2">
                    <input
                      value={commentText}
                      onChange={(event) => setCommentText(event.target.value)}
                      placeholder={`Write comment as ${
                        currentAuthor.name || "User"
                      }...`}
                      className="h-10 flex-1 rounded-md border border-input bg-card px-3 text-sm text-card-foreground outline-none focus:border-primary"
                    />

                    <button
                      type="button"
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                      className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Post
                    </button>
                  </div>

                  <div className="mt-5 space-y-3">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="rounded-lg border border-border bg-muted/40 px-4 py-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold text-foreground">
                              {comment.userName || "User"}
                            </p>

                            <span className="text-xs text-muted-foreground">
                              {formatCommentTime(comment.createdAt)}
                            </span>
                          </div>

                          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                            {comment.text}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No comments yet.
                      </div>
                    )}
                  </div>
                </>
              )}
            </section>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-6">
              <ImageAd
                ads={topAds}
                label="News detail top advertisement"
                size="large"
                priority
              />

              <ImageAd
                ads={bottomAds}
                label="News detail bottom advertisement"
                size="medium"
              />
            </div>
          </aside>
        </div>
      </section>
    </MainLayout>
  );
}