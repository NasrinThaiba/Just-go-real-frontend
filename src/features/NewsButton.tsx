import { useEffect, useMemo, useState } from "react";

import NewsMeta from "./NewsMeta";
import NewsActions from "./NewsActions";

import type { PostComment } from "@/types/news";
import { getCurrentAuthor } from "@/helper/getCurrentAuthor";
import { getStoredComments, savePostComment } from "@/utils/commentStorage";

type NewsButtonProps = {
  postId?: number;

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

  initialComments?: PostComment[];

  /**
   * true  = show full comment list
   * false = only show input + post button
   */
  showCommentList?: boolean;

  shareUrl?: string;
  shareTitle?: string;
};

function mergeComments(
  initialComments: PostComment[],
  storedComments: PostComment[]
) {
  const map = new Map<number, PostComment>();

  initialComments.forEach((comment) => {
    map.set(comment.id, comment);
  });

  storedComments.forEach((comment) => {
    map.set(comment.id, comment);
  });

  return Array.from(map.values()).sort((a, b) => a.id - b.id);
}

function formatCommentTime(createdAt?: string) {
  if (!createdAt) return "Now";

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Now";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NewsButton({
  postId,

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

  initialComments = [],

  showCommentList = false,

  shareUrl = window.location.href,
  shareTitle = "Check this news",
}: NewsButtonProps) {
  const loggedInAuthor = useMemo(() => getCurrentAuthor(), []);
  const loggedInUserName = loggedInAuthor.name || "User";

  const [liked, setLiked] = useState(false);
  const [likedCount, setLikedCount] = useState(initialLikedCount);

  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");

  const [comments, setComments] = useState<PostComment[]>(() => {
    if (!postId) return initialComments;

    return mergeComments(initialComments, getStoredComments(postId));
  });

  const [shareCount, setShareCount] = useState(initialShareCount);

  const commentCount = useMemo(() => {
    return Math.max(initialCommentCount, comments.length);
  }, [comments.length, initialCommentCount]);

  useEffect(() => {
    if (!postId) return;

    setComments(mergeComments(initialComments, getStoredComments(postId)));
  }, [postId, initialComments]);

  function handleLikeToggle(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    const next = !liked;

    setLiked(next);
    setLikedCount((prev) => (next ? prev + 1 : Math.max(prev - 1, 0)));

    onLike?.(next);
  }

  function handleCommentClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    setShowCommentBox((prev) => !prev);
  }

  function handleCommentSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    const text = commentText.trim();

    if (!text) return;

    const newComment: PostComment = {
      id: Date.now(),
      userName: loggedInUserName,
      text,
      createdAt: new Date().toISOString(),
    };

    const updatedComments = [...comments, newComment];

    setComments(updatedComments);

    if (postId) {
      savePostComment(postId, newComment);
    }

    onComment?.(text);

    setCommentText("");
    setShowCommentBox(false);
  }

  async function handleShareClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

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
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="w-full pb-2 pt-2">
      <NewsMeta name={name} logo={logo} />

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{time}</span>
          <span>•</span>
          <span>{views} views</span>
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

      {showCommentBox && (
        <div
          className="mt-3 space-y-3"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start gap-2">
            <textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder={`Comment as ${loggedInUserName}...`}
              rows={1}
              className="min-h-9 flex-1 resize-none rounded-md border border-border bg-card px-3 py-2 text-sm text-card-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />

            <button
              type="button"
              onClick={handleCommentSubmit}
              disabled={!commentText.trim()}
              className="h-9 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
            >
              Post
            </button>
          </div>

          {showCommentList && (
            <div className="rounded-lg border border-border bg-muted/40">
              <div className="border-b border-border px-3 py-2">
                <p className="text-xs font-semibold text-foreground">
                  Comments ({commentCount})
                </p>
              </div>

              {comments.length > 0 ? (
                <div className="max-h-64 space-y-2 overflow-y-auto p-3">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="rounded-lg bg-card px-3 py-2 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {comment.userName || "User"}
                        </p>

                        <span className="shrink-0 text-[11px] text-muted-foreground">
                          {formatCommentTime(comment.createdAt)}
                        </span>
                      </div>

                      <p className="mt-1 whitespace-pre-line text-sm leading-5 text-muted-foreground">
                        {comment.text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-sm text-muted-foreground">
                  No comments yet. Be the first to comment.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}