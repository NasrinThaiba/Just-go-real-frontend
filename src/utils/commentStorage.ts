import type { PostComment } from "@/types/news";

const COMMENT_STORAGE_KEY = "jgr_post_comments";

const FEED_STORAGE_KEYS = [
  "jgr_feed_posts",
  "jgr_news_posts",
  "jgr_video_posts",
  "jgr_created_posts",
  "local_news_posts",
];

type CommentStore = Record<string, PostComment[]>;

function isPostComment(value: unknown): value is PostComment {
  if (!value || typeof value !== "object") return false;

  const comment = value as Partial<PostComment>;

  return (
    typeof comment.id === "number" &&
    typeof comment.userName === "string" &&
    typeof comment.text === "string" &&
    typeof comment.createdAt === "string"
  );
}

function getCommentStore(): CommentStore {
  try {
    const raw = localStorage.getItem(COMMENT_STORAGE_KEY);

    if (!raw) return {};

    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return parsed as CommentStore;
  } catch {
    return {};
  }
}

export function getStoredComments(postId: number): PostComment[] {
  const store = getCommentStore();

  const comments = store[String(postId)] ?? [];

  return comments.filter(isPostComment);
}

export function savePostComment(postId: number, comment: PostComment) {
  const store = getCommentStore();
  const key = String(postId);

  const updatedComments = [...(store[key] ?? []), comment];

  localStorage.setItem(
    COMMENT_STORAGE_KEY,
    JSON.stringify({
      ...store,
      [key]: updatedComments,
    })
  );

  updateCommentInsideFeedPosts(postId, updatedComments);
}

export function setPostComments(postId: number, comments: PostComment[]) {
  const store = getCommentStore();
  const key = String(postId);

  localStorage.setItem(
    COMMENT_STORAGE_KEY,
    JSON.stringify({
      ...store,
      [key]: comments,
    })
  );

  updateCommentInsideFeedPosts(postId, comments);
}

function updateCommentInsideFeedPosts(
  postId: number,
  comments: PostComment[]
) {
  for (const key of FEED_STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(key);

      if (!raw) continue;

      const posts = JSON.parse(raw);

      if (!Array.isArray(posts)) continue;

      let changed = false;

      const updatedPosts = posts.map((post) => {
        if (post?.id === postId) {
          changed = true;

          return {
            ...post,
            comments,
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