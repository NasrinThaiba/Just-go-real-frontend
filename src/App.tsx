import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NewsDetailPage from "./DetailPages/NewsDetailPage";
import CreateNews from "./DetailPages/CreateNews";
import CreateVideo from "./DetailPages/CreateVideos";
import LoginPage from "./pages/login-page";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile-settings" element={<ProfileSettingsPage />} />
      <Route path="/news/:id" element={<NewsDetailPage />} />
      <Route path="/create-news" element={<CreateNews />} />
      <Route path="/create-video" element={<CreateVideo />} />
    </Routes>
  );
}

export default App;

