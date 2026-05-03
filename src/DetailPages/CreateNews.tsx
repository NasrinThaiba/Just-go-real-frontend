import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  ImagePlus,
  Languages,
  MapPin,
  Newspaper,
  Send,
  X,
} from "lucide-react";

import type {
  NewsPostPayload,
  PostAuthor,
  PostLanguage,
} from "@/types/news";

import { saveFeedPost } from "@/utils/feedStorage";
import { getCurrentAuthor } from "@/helper/getCurrentAuthor";

const categories = [
  "Local",
  "Breaking News",
  "Politics",
  "Crime",
  "Sports",
  "Entertainment",
  "Business",
  "Education",
  "Weather",
  "Technology",
  "Health",
  "Science",
  "Viral",
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

export default function CreateNews() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const author = useMemo<PostAuthor>(() => getCurrentAuthor(), []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("Local");
  const [location, setLocation] = useState("All");
  const [language, setLanguage] = useState<PostLanguage>("en");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const descriptionCount = description.length;

  const isPublishDisabled = !title.trim() || !description.trim();

  const previewTitle = useMemo(() => {
    return title.trim() || "Your news headline will appear here";
  }, [title]);

  const previewDescription = useMemo(() => {
    return (
      description.trim() ||
      "Write the news details. The preview will update while you type."
    );
  }, [description]);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(String(reader.result));
    };

    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory("Local");
    setLocation("All");
    setLanguage("en");
    setImageFile(null);
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handlePublish() {
    if (isPublishDisabled) return;

    const payload: NewsPostPayload = {
      id: Date.now(),
      type: "news",

      title: title.trim(),
      description: description.trim(),

      mediaType: "image",
      mediaUrl: imagePreview ?? undefined,

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

    alert("News post published successfully!");
    resetForm();
    navigate("/");
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        {/* LEFT SIDE */}
        <section className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h1 className="text-xl font-bold text-card-foreground">
              Create News Post
            </h1>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-sm">
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
                  News Headline
                </label>

                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Example: Heavy rain lashes Chennai city"
                  className="w-full rounded-xl border border-input bg-card px-4 py-3 text-base font-semibold text-card-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/20"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-foreground">
                    News Details
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
                  placeholder="Write the full news content here. Add important details like what happened, where it happened, when it happened, and why users should care..."
                  className="w-full resize-none rounded-xl border border-input bg-card px-4 py-3 text-sm leading-6 text-card-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/20"
                />
              </div>

              {/* IMAGE UPLOAD */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {!imagePreview ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-44 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted text-muted-foreground transition hover:bg-secondary"
                  >
                    <ImagePlus className="mb-2 h-8 w-8 text-accent" />

                    <span className="text-sm font-semibold">Choose Image</span>

                    <span className="mt-1 text-xs">
                      JPG, PNG, WEBP supported
                    </span>
                  </button>
                ) : (
                  <div className="relative overflow-hidden rounded-2xl border border-border">
                    <img
                      src={imagePreview}
                      alt="News preview"
                      className="h-80 w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute right-3 top-3 rounded-full bg-destructive p-2 text-destructive-foreground transition hover:opacity-90"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {imageFile && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Selected: {imageFile.name}
                  </p>
                )}
              </div>

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
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition hover:bg-muted"
                  >
                    <ImagePlus className="h-4 w-4 text-accent" />
                    Add Image
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition hover:bg-muted"
                  >
                    <Newspaper className="h-4 w-4 text-primary" />
                    News
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
                  Publish News
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE LIVE PREVIEW */}
        <aside className="lg:sticky lg:top-6 lg:h-fit">
          <div className="rounded-2xl border border-border bg-card shadow-sm">
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

              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-4 h-56 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="mt-4 flex h-56 items-center justify-center rounded-xl border border-dashed border-border bg-muted text-sm text-muted-foreground">
                  Image preview will appear here
                </div>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span>Ready for news feed</span>
                <span>Image News</span>
              </div>
            </article>
          </div>
        </aside>
      </div>
    </main>
  );
}