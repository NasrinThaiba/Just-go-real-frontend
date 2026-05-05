import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Languages,
  Link2,
  MapPin,
  PlayCircle,
  Send,
  UploadCloud,
  Video,
  X,
} from "lucide-react";

import type {
  PostAuthor,
  PostLanguage,
  VideoPostPayload,
  VideoSource,
} from "@/types/news";

import { saveFeedPost } from "@/utils/feedStorage";
import { getCurrentAuthor } from "@/helper/getCurrentAuthor";

const categories = [
  "Video",
  "Viral",
  "Breaking News",
  "Local",
  "Politics",
  "Crime",
  "Sports",
  "Entertainment",
  "Business",
  "Education",
  "Weather",
  "Technology",
  "Health",
];

const locations = [
  "All",
  "Tenkasi",
  "Tirunelveli",
  "Madurai",
  "Chennai",
  "Coimbatore",
  "Kerala",
];

function getAuthorInitials(name: string) {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function convertYoutubeUrlToEmbedUrl(url: string) {
  const value = url.trim();

  if (!value) return "";

  if (value.includes("youtube.com/embed/")) {
    return value;
  }

  const watchMatch = value.match(/[?&]v=([^&]+)/);
  if (watchMatch?.[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  const shortMatch = value.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch?.[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  const shortsMatch = value.match(/youtube\.com\/shorts\/([^?&]+)/);
  if (shortsMatch?.[1]) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  }

  return value;
}

export default function CreateVideo() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const author = useMemo<PostAuthor>(() => getCurrentAuthor(), []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("Video");
  const [location, setLocation] = useState("All");
  const [language, setLanguage] = useState<PostLanguage>("en");

  const [videoSource, setVideoSource] = useState<VideoSource>("upload");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const descriptionCount = description.length;

  const finalYoutubeUrl = useMemo(() => {
    return convertYoutubeUrlToEmbedUrl(youtubeUrl);
  }, [youtubeUrl]);

  const mediaUrl = videoSource === "youtube" ? finalYoutubeUrl : videoPreview;

  const isPublishDisabled =
    !title.trim() ||
    !description.trim() ||
    (videoSource === "upload" && !videoPreview) ||
    (videoSource === "youtube" && !finalYoutubeUrl.trim());

  const previewTitle = useMemo(() => {
    return title.trim() || "Your video headline will appear here";
  }, [title]);

  const previewDescription = useMemo(() => {
    return (
      description.trim() ||
      "Write the video details. The preview will update while you type."
    );
  }, [description]);

  function handleVideoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please upload a valid video file.");
      return;
    }

    setVideoFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setVideoPreview(String(reader.result));
    };

    reader.readAsDataURL(file);
  }

  function removeVideo() {
    setVideoFile(null);
    setVideoPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory("Video");
    setLocation("All");
    setLanguage("en");
    setVideoSource("upload");
    setYoutubeUrl("");
    setVideoFile(null);
    setVideoPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handlePublish() {
    if (isPublishDisabled || !mediaUrl) return;

    const payload: VideoPostPayload = {
      id: Date.now(),
      type: "video",

      title: title.trim(),
      description: description.trim(),

      mediaType: "video",
      videoSource,
      mediaUrl,

      category,
      location,
      language,

      author: {
        name: author.name,
        role: author.role,
        avatar: author.avatar,
        phone: author.phone,
      },

      createdAt: new Date().toISOString(),

      views: 0,
      likes: 0,
      shares: 0,
      comments: [],
    };

    saveFeedPost(payload);

    alert("Video post published successfully!");
    resetForm();
    navigate("/video");
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        {/* LEFT SIDE */}
        <section className="space-y-4">
          <div className="border border-border bg-card p-5 shadow-sm">
            <h1 className="text-xl font-bold text-card-foreground">
              Create Video Post
            </h1>
          </div>

          <div className="border border-border bg-card shadow-sm">
            {/* AUTHOR ROW */}
            <div className="flex items-center gap-3 border-b border-border p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {author.avatar ? (
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  getAuthorInitials(author.name)
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="truncate font-semibold text-card-foreground">
                  {author.name}
                </h2>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-verified px-2 py-0.5 text-xs font-medium text-verified-foreground">
                    {author.role}
                  </span>

                  <span>•</span>

                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-accent" />
                    {location}
                  </span>

                  <span>•</span>

                  <span>{category}</span>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-5">
              {/* TITLE */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Video Headline
                </label>

                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Example: Ground report from Chennai traffic zone"
                  className="w-full rounded-xl border border-input bg-card px-4 py-3 text-base font-semibold text-card-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/20"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-foreground">
                    Video Details
                  </label>

                  <span className="text-xs text-muted-foreground">
                    {descriptionCount}/1200
                  </span>
                </div>

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={1200}
                  rows={8}
                  placeholder="Write the video details here. Add what happened, where it happened, why it matters, and what viewers should know..."
                  className="w-full resize-none rounded-xl border border-input bg-card px-4 py-3 text-sm leading-6 text-card-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/20"
                />
              </div>

              {/* VIDEO SOURCE */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Video Source
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVideoSource("upload")}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      videoSource === "upload"
                        ? "border-ring bg-primary text-primary-foreground"
                        : "border-border bg-card text-card-foreground hover:bg-muted"
                    }`}
                  >
                    <UploadCloud className="h-4 w-4" />
                    Upload
                  </button>

                  <button
                    type="button"
                    onClick={() => setVideoSource("youtube")}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      videoSource === "youtube"
                        ? "border-ring bg-primary text-primary-foreground"
                        : "border-border bg-card text-card-foreground hover:bg-muted"
                    }`}
                  >
                    <Link2 className="h-4 w-4" />
                    YouTube
                  </button>
                </div>
              </div>

              {/* UPLOAD VIDEO */}
              {videoSource === "upload" && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />

                  {!videoPreview ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex h-52 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted text-muted-foreground transition hover:bg-secondary"
                    >
                      <Video className="mb-2 h-9 w-9 text-accent" />

                      <span className="text-sm font-semibold">
                        Choose Video
                      </span>

                      <span className="mt-1 text-xs">
                        MP4, WEBM, MOV supported
                      </span>
                    </button>
                  ) : (
                    <div className="relative overflow-hidden rounded-2xl border border-border bg-black">
                      <video
                        src={videoPreview}
                        controls
                        className="h-80 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={removeVideo}
                        className="absolute right-3 top-3 rounded-full bg-destructive p-2 text-destructive-foreground transition hover:opacity-90"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {videoFile && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Selected: {videoFile.name}
                    </p>
                  )}
                </div>
              )}

              {/* YOUTUBE URL */}
              {videoSource === "youtube" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    YouTube URL
                  </label>

                  <input
                    value={youtubeUrl}
                    onChange={(event) => setYoutubeUrl(event.target.value)}
                    placeholder="Paste YouTube link or embed URL"
                    className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm font-semibold text-card-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/20"
                  />

                  {finalYoutubeUrl && (
                    <div className="mt-4 aspect-video overflow-hidden rounded-2xl border border-border bg-black">
                      <iframe
                        src={finalYoutubeUrl}
                        title="YouTube preview"
                        className="h-full w-full"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              )}

              {/* DROPDOWNS */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full rounded-xl border border-input bg-card px-3 py-3 text-sm text-card-foreground outline-none focus:border-ring focus:ring-4 focus:ring-ring/20"
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Location
                  </label>

                  <select
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className="w-full rounded-xl border border-input bg-card px-3 py-3 text-sm text-card-foreground outline-none focus:border-ring focus:ring-4 focus:ring-ring/20"
                  >
                    {locations.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Language
                  </label>

                  <select
                    value={language}
                    onChange={(event) =>
                      setLanguage(event.target.value as PostLanguage)
                    }
                    className="w-full rounded-xl border border-input bg-card px-3 py-3 text-sm text-card-foreground outline-none focus:border-ring focus:ring-4 focus:ring-ring/20"
                  >
                    <option value="en">English</option>
                    <option value="ta">Tamil</option>
                  </select>
                </div>
              </div>

              {/* ACTION BAR */}
              <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setVideoSource("upload");
                      fileInputRef.current?.click();
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition hover:bg-muted"
                  >
                    <UploadCloud className="h-4 w-4 text-accent" />
                    Add Video
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition hover:bg-muted"
                  >
                    <PlayCircle className="h-4 w-4 text-primary" />
                    Video
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition hover:bg-muted"
                  >
                    <Languages className="h-4 w-4 text-accent" />
                    {language === "en" ? "English" : "Tamil"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isPublishDisabled}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                >
                  <Send className="h-4 w-4" />
                  Publish Video
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE LIVE PREVIEW */}
        <aside className="lg:sticky lg:top-6 lg:h-fit">
          <div className="border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border p-4">
              <Eye className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-card-foreground">
                Live Preview
              </h3>
            </div>

            <article className="p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {author.avatar ? (
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    getAuthorInitials(author.name)
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-card-foreground">
                    {author.name}
                  </h4>

                  <p className="text-xs text-muted-foreground">
                    {author.role} • {category} • {location} •{" "}
                    {language === "en" ? "English" : "Tamil"}
                  </p>
                </div>
              </div>

              <h2 className="text-lg font-bold leading-snug text-foreground">
                {previewTitle}
              </h2>

              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                {previewDescription}
              </p>

              {videoSource === "upload" && videoPreview && (
                <video
                  src={videoPreview}
                  controls
                  className="mt-4 h-56 w-full rounded-xl object-cover"
                />
              )}

              {videoSource === "youtube" && finalYoutubeUrl && (
                <iframe
                  src={finalYoutubeUrl}
                  title="Video preview"
                  className="mt-4 aspect-video w-full rounded-xl"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              )}

              {!mediaUrl && (
                <div className="mt-4 flex h-56 items-center justify-center rounded-xl border border-dashed border-border bg-muted text-sm text-muted-foreground">
                  Video preview will appear here
                </div>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span>Ready for video feed</span>
                <span>{videoSource === "youtube" ? "YouTube" : "Upload"}</span>
              </div>
            </article>
          </div>
        </aside>
      </div>
    </main>
  );
}