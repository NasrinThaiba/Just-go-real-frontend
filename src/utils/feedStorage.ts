import type { FeedItem } from "@/types/news";

const FEED_STORAGE_KEY = "jgr_feed_posts";

export function getStoredFeedPosts(): FeedItem[] {
  try {
    const raw = localStorage.getItem(FEED_STORAGE_KEY);

    if (!raw) return [];

    const parsed = JSON.parse(raw) as FeedItem[];

    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch {
    return [];
  }
}

export function saveFeedPost(post: FeedItem) {
  const existingPosts = getStoredFeedPosts();

  const updatedPosts = [post, ...existingPosts];

  localStorage.setItem(FEED_STORAGE_KEY, JSON.stringify(updatedPosts));

  window.dispatchEvent(new Event("feed-posts-updated"));

  return updatedPosts;
}

export function clearStoredFeedPosts() {
  localStorage.removeItem(FEED_STORAGE_KEY);

  window.dispatchEvent(new Event("feed-posts-updated"));
}