import { useEffect, useState, useMemo } from "react";
import MainLayout from "./MainLayout";
import NewsHomePage from "./NewsHomePage";
import VideoHomePage from "./VideoHomePage";
import ViralHomePage from "./ViralHomePage";
import FloatingProfileButton from "@/components/FloatingProfileButton";
import { DEFAULT_CATEGORY_BY_HEAD, type HeadTab } from "./Navbar";
import { newsData } from "@/data/newsData";
import { getStoredFeedPosts } from "@/utils/feedStorage";
import { type FeedItem, type NewsPostPayload, type VideoPostPayload } from "@/types/news";

export default function HomePage() {
  const [activeHead, setActiveHead] = useState<HeadTab>("news");
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY_BY_HEAD.news);
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [language, setLanguage] = useState<"en" | "ta">("en");

  // ✅ INIT FROM SESSION STORAGE
  const [newsList, setNewsList] = useState<FeedItem[]>(() => {
    const stored = sessionStorage.getItem("news_views");
    const viewsMap = stored ? JSON.parse(stored) : {};

    return newsData.map((item) => ({
      ...item,
      views: viewsMap[item.id] ?? item.views ?? 0,
    }));
  });

  const increaseView = (id: number) => {
    setNewsList((prev) => {
      const updated = prev.map((item) =>
        item.id === id
          ? { ...item, views: (item.views || 0) + 1 }
          : item
      );

      // ✅ SAVE TO SESSION STORAGE
      const viewMap = updated.reduce((acc, item) => {
        acc[item.id] = item.views || 0;
        return acc;
      }, {} as Record<number, number>);

      sessionStorage.setItem("news_views", JSON.stringify(viewMap));

      return updated;
    });
  };


  const filteredData: FeedItem[] = useMemo(() => {
    return newsList.filter((item) => {
      const locationMatch =
        selectedLocation === "All" ||
        (item.type === "news" && item.location === selectedLocation);

      const languageMatch = item.language === language;

      return locationMatch && languageMatch;
    });
  }, [newsList, selectedLocation, language]);

  const news: NewsPostPayload[] = filteredData.filter(
    (item): item is NewsPostPayload => item.type === "news"
  );

  const videos: VideoPostPayload[] = filteredData.filter(
    (item): item is VideoPostPayload => item.type === "video"
  );

  const viral: NewsPostPayload[] = useMemo(() => {
  return newsList
    .filter((item): item is NewsPostPayload => item.type === "news")
    .filter((item) => {
      const locationMatch =
        selectedLocation === "All" || item.location === selectedLocation;

      const languageMatch = item.language === language;

      return locationMatch && languageMatch;
    })
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10);
}, [newsList, selectedLocation, language]);
  
  function loadFeedPosts() {
  const storedPosts = getStoredFeedPosts();

  const storedViews = sessionStorage.getItem("news_views");
  const viewsMap = storedViews ? JSON.parse(storedViews) : {};

  const merged = [...storedPosts, ...newsData].map((item) => ({
    ...item,
    views: viewsMap[item.id] ?? item.views ?? 0,
  }));

  setNewsList(merged);
}

  useEffect(() => {
    loadFeedPosts();

    window.addEventListener("feed-posts-updated", loadFeedPosts);

    return () => {
      window.removeEventListener("feed-posts-updated", loadFeedPosts);
    };
  }, []);




  return (
    <>
      <FloatingProfileButton />

      <MainLayout
        activeHead={activeHead}
        activeCategory={activeCategory}
        onHeadChange={setActiveHead}
        onCategoryChange={setActiveCategory}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        language={language}
        onLanguageChange={setLanguage}
      >
        {/* 📰 NEWS */}
        {activeHead === "news" && (
          <NewsHomePage
            news={news}
            language={language}
            selectedLocation={selectedLocation}
            onView={increaseView}
          />
        )}

        {/* 🎬 VIDEO */}
        {activeHead === "video" && (
          <VideoHomePage videos={videos} />
        )}

        {/* 🔥 VIRAL */}
        {activeHead === "viral" && (
  <ViralHomePage
    viral={viral}
    activeCategory={activeCategory}
    onView={increaseView}
  />
)}
      </MainLayout>
    </>
  );
}