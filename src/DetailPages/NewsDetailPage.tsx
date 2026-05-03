import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "@/pages/MainLayout";
import NewsButton from "@/features/NewsButton";
import { DEFAULT_CATEGORY_BY_HEAD, type HeadTab } from "@/pages/Navbar";
import { newsData } from "../data/newsData";
import { type PostComment } from "@/types/news";
import logo from "../assets/logo.png";
import { getTimeAgo } from "@/helper/getTimeAgo";
import { getStoredFeedPosts } from "@/utils/feedStorage";

// ✅ SAFE FUNCTION
// function splitIntoParagraphs(text: string = "", sentencesPerParagraph = 3) {
//   if (!text) return [];

//   const sentences =
//     text.match(/[^.!?]+[.!?]+/g) || [text]; // fallback

//   const paragraphs: string[] = [];

//   for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
//     paragraphs.push(sentences.slice(i, i + sentencesPerParagraph).join(" "));
//   }

//   return paragraphs;
// }

function formatDescription(text?: string) {
  if (!text) return ["No description available"];

  // If user already added line breaks → respect them
  if (text.includes("\n")) {
    return text
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
  }

  // Otherwise split into readable paragraphs (2–3 sentences each)
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  const paragraphs: string[] = [];

  for (let i = 0; i < sentences.length; i += 2) {
    paragraphs.push(sentences.slice(i, i + 2).join(" "));
  }

  return paragraphs;
}


export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeHead, setActiveHead] = useState<HeadTab>("news");
  const [activeCategory, setActiveCategory] = useState<string>(
    DEFAULT_CATEGORY_BY_HEAD.news
  );
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [language, setLanguage] = useState<"en" | "ta">("en");

  const newsItem = useMemo(() => {
  const storedPosts = getStoredFeedPosts();

  const storedViews = sessionStorage.getItem("news_views");
  const viewMap = storedViews ? JSON.parse(storedViews) : {};

  const allNews = [...storedPosts, ...newsData].map((item) => ({
    ...item,
    views: viewMap[item.id] ?? item.views ?? 0,
  }));

  return allNews.find(
    (item) => item.id === Number(id) && item.type === "news"
  );
}, [id]);

  const [views, setViews] = useState<number>(0);

  useEffect(() => {
    if (!newsItem) return;

    const stored = sessionStorage.getItem("news_views");
    const viewMap = stored ? JSON.parse(stored) : {};

    const initialViews =
      viewMap[newsItem.id] ?? newsItem.views ?? 0;

    setViews(initialViews);
  }, [newsItem]);


  // ✅ comment states
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);

  // ✅ sync comments properly
  useEffect(() => {
    if (newsItem?.comments) {
      setComments(newsItem.comments);
    }
  }, [newsItem]);


  const commentsRef = useRef<HTMLElement | null>(null);

  const handleOpenComments = () => {
    setShowComments(true);

    requestAnimationFrame(() => {
      commentsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const handleAddComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;

    const newComment: PostComment = {
      id: Date.now(),
      userName: "You",
      createdAt: "Just now",
      text: trimmed,
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentText("");
    setShowComments(true);
  };

  // ❌ not found
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
        <h1 className="text-2xl font-bold">News not found</h1>
        <button onClick={() => navigate("/")}>Go Back</button>
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
      <div className="news-shell">
        <div className="news-detail-grid">
          <article className="min-w-0">

            {/* TITLE */}
            <h1 className="news-detail-title">
              {newsItem.title}
            </h1>

            {/* IMAGE */}
            {newsItem.mediaUrl && (
              <div className="mt-6 overflow-hidden rounded-sm">
                <img
                  src={newsItem.mediaUrl}
                  alt={newsItem.title}
                  className="news-detail-image"
                />
              </div>
            )}

            {/* BUTTON */}
            <div className="pt-4">
              <NewsButton
                name={newsItem.author.name}
                time={getTimeAgo(newsItem.createdAt)}
                logo={newsItem.author.avatar || logo}
                views={views}
                initialLikedCount={newsItem.likes}
                initialCommentCount={comments.length}
                initialShareCount={newsItem.shares}
                shareTitle={newsItem.title}
                shareUrl={`${window.location.origin}/news/${newsItem.id}`}
                onLike={(liked) => console.log(liked)}
                onComment={handleOpenComments}
                onShare={() => console.log("shared")}
              />
            </div>

            {/* CONTENT */}
            {/* <div className="news-detail-body"> */}
              {/* {splitIntoParagraphs(newsItem.description, 3).map(
                (paragraph, index) => (
                  <p key={index} className="news-detail-paragraph">
                    {paragraph}
                  </p>
                )
              )} */}
              {/* {newsItem.description}
            </div> */}

            <div className="news-detail-body">
  {formatDescription(newsItem.description || "").map((paragraph, index) => (
  <p key={index} className="news-detail-paragraph">
    {paragraph.trim()}
  </p>
))}
</div>

            {/* COMMENTS */}
            <section ref={commentsRef} className="news-comments-section">
              <div className="flex items-center justify-between">
                <div className="news-comments-title">
                  Comments ({comments.length})
                  </div>
                  
            <button
            onClick={() => setShowComments((p) => !p)}
            className="news-comment-post"
            >
              {showComments ? "Hide" : "Show"}
              </button>
              </div>
              
    {showComments && (
      <>
      {/* INPUT */}
      <div className="mt-4 flex gap-2">
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write comment..."
          className="news-comment-input"
        />
        <button
          onClick={handleAddComment}
          className="news-comment-post"
        >
          Post
        </button>
      </div>

      {/* COMMENTS LIST */}
      <div className="mt-5 space-y-3">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.id} className="news-comment-card">
              <div className="news-comment-name">{c.userName}</div>
              <div className="news-comment-time">{c.createdAt}</div>
              <p className="news-comment-text">{c.text}</p>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">
            No comments yet
          </div>
        )}
      </div>
    </>
  )}
</section>

          </article>

          {/* ADS */}
          <aside className="hidden lg:block">
            <div className="space-y-4">
              <div className="news-ad-box">Ad</div>
              <div className="news-ad-box">Ad</div>
            </div>
          </aside>

        </div>
      </div>
    </MainLayout>
  );
}