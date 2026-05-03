import { useState } from "react";
import NewsMeta from "./NewsMeta";
import NewsActions from "./NewsActions";

type NewsButtonProps = {
  name: string;
  time: string;
  logo?: string;

  views?: number;

  onLike?: (liked: boolean) => void;
  onComment?: (comment: string) => void;
  onShare?: () => void;

  initialLikedCount?: number;
  initialCommentCount?: number;
  initialShareCount?: number;

  shareUrl?: string;
  shareTitle?: string;
};

export default function NewsButton({
  name,
  time,
  logo,
  views = 0,

  onLike,
  onComment,
  onShare,

  initialLikedCount = 0,
  initialCommentCount = 0,
  initialShareCount = 0,

  shareUrl = window.location.href,
  shareTitle = "Check this news",
}: NewsButtonProps) {

  /* =========================
      ❤️ LIKE
  ========================== */

  const [liked, setLiked] = useState(false);
  const [likedCount, setLikedCount] = useState(initialLikedCount);

  const handleLikeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const next = !liked;
    setLiked(next);
    setLikedCount((prev) =>
      next ? prev + 1 : Math.max(prev - 1, 0)
    );
    onLike?.(next);
  };

  /* =========================
      💬 COMMENT
  ========================== */

  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentCount, setCommentCount] = useState(initialCommentCount);

  const handleCommentClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowCommentBox((prev) => !prev);
  };

  const handleCommentSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!commentText.trim()) return;

    setCommentCount((prev) => prev + 1);
    onComment?.(commentText);
    setCommentText("");
    setShowCommentBox(false);
  };

  /* =========================
      🔗 SHARE
  ========================== */

  const [shareCount, setShareCount] = useState(initialShareCount);

  const handleShareClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }

      setShareCount((prev) => prev + 1);
      onShare?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full pt-2 pb-2">

      <NewsMeta name={name} logo={logo} />

      <div className="mt-2 flex items-center justify-between">

        {/* ⏱ + 👁 */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{time}</span>
          <span>•</span>
          <span>{views} views</span> {/* ✅ DIRECT FROM PROPS */}
        </div>

        <NewsActions
          liked={liked}
          likedCount={likedCount}
          commentCount={commentCount}
          shareCount={shareCount}
          onLikeToggle={handleLikeToggle}
          onCommentClick={handleCommentClick}
          onShareClick={handleShareClick}
        />
      </div>

      {/* COMMENT BOX */}
      {showCommentBox && (
        <div className="mt-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">

            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              rows={1}
              className="flex-1 resize-none rounded-md border px-3 py-2 text-sm outline-none focus:border-primary"
            />

            <button
              onClick={handleCommentSubmit}
              className="h-7 rounded-md bg-primary px-3 text-sm text-white"
            >
              Post
            </button>

          </div>
        </div>
      )}

    </div>
  );
}