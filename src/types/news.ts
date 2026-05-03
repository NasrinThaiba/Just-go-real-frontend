export type PostLanguage = "en" | "ta";

export type AuthorRole = "Admin" | "Reportor" | "Contributor" | "Guest";

export type VideoSource = "upload" | "youtube";

export type PostAuthor = {
  name: string;
  role: AuthorRole;
  avatar?: string;
  phone?: string;
};

export type PostComment = {
  id: number;
  userName: string;
  text: string;
  createdAt: string;
};

export type BasePostPayload = {
  id: number;
  title: string;
  description?: string;

  category: string;
  location: string;
  language: PostLanguage;

  author: PostAuthor;

  createdAt: string;

  views: number;
  likes: number;
  shares: number;
  comments: PostComment[];
};

export type NewsPostPayload = BasePostPayload & {
  type: "news";
  description: string;
  mediaType: "image";
  mediaUrl?: string;
};

export type VideoPostPayload = BasePostPayload & {
  type: "video";
  mediaType: "video";
  videoSource: VideoSource;
  mediaUrl: string;
};

export type FeedItem = NewsPostPayload | VideoPostPayload;