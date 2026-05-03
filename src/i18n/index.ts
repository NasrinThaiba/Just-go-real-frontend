import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        auth: {
          loginTitle: "Login with OTP",
          loginSubtitle: "Securely sign in using your mobile number",
          sendOtp: "Send OTP",
        },
        head: {
          news: "News",
          video: "Video",
          viral: "Viral",
        },
        navbar: {
          news: {
            main: {
              home: "Home",
              news: "News",
              trendingTopics: "Trending Topics",
              world: "World",
              sirInStates: "SIR In States",
              middleEastConflict: "Middle-East conflict",
            },
            more: {
              football: "Football",
              featured: "News and Featured",
              dailyShare: "Daily Share",
              autoZone: "Auto Zone",
              movies: "Movies and Entertainment",
              businessFinance: "Business and Finance",
            },
          },
          video: {
            main: {
              news: "News",
              liveTv: "Live TV",
              moviesEntertainment: "Movies & Entertainment",
              humour: "Humour",
            },
            more: {
              sports: "Sports",
              music: "Music",
              interviews: "Interviews",
              shortVideos: "Short Videos",
            },
          },
          viral: {
            main: {
              all: "All",
              greetings: "Greetings",
              thoughtForTheDay: "Thought For The Day",
              healthLifestyle: "Health & Lifestyle",
              trending: "Trending",
              friendship: "Friendship",
            },
            more: {
              motivation: "Motivation",
              love: "Love",
              memes: "Memes",
              festival: "Festival",
            },
          },
        },
        common: {
          english: "English",
          tamil: "தமிழ்",
          chooseLocation: "Choose location",
        },
      },
    },

    ta: {
      translation: {
        auth: {
          loginTitle: "OTP மூலம் உள்நுழைக",
          loginSubtitle: "உங்கள் மொபைல் எண்ணை பயன்படுத்தி பாதுகாப்பாக உள்நுழைக",
          sendOtp: "OTP அனுப்பு",
        },
        head: {
          news: "செய்திகள்",
          video: "வீடியோக்கள்",
          viral: "வைரல்",
        },
        navbar: {
          news: {
            main: {
              home: "முகப்பு",
              news: "செய்திகள்",
              trendingTopics: "பிரபலமானவை",
              world: "உலகம்",
              sirInStates: "மாநிலங்களில் SIR",
              middleEastConflict: "மத்திய கிழக்கு மோதல்",
            },
            more: {
              football: "கால்பந்து",
              featured: "சிறப்பு செய்திகள்",
              dailyShare: "தினசரி பகிர்வு",
              autoZone: "ஆட்டோ பகுதி",
              movies: "திரைப்படம் மற்றும் பொழுதுபோக்கு",
              businessFinance: "வணிகம் மற்றும் நிதி",
            },
          },
          video: {
            main: {
              news: "செய்திகள்",
              liveTv: "நேரலை டிவி",
              moviesEntertainment: "திரைப்படம் மற்றும் பொழுதுபோக்கு",
              humour: "நகைச்சுவை",
            },
            more: {
              sports: "விளையாட்டு",
              music: "இசை",
              interviews: "நேர்காணல்கள்",
              shortVideos: "குறும்பட வீடியோக்கள்",
            },
          },
          viral: {
            main: {
              all: "அனைத்தும்",
              greetings: "வாழ்த்துகள்",
              thoughtForTheDay: "இன்றைய சிந்தனை",
              healthLifestyle: "ஆரோக்கியம் மற்றும் வாழ்க்கைமுறை",
              trending: "பிரபலமானவை",
              friendship: "நட்பு",
            },
            more: {
              motivation: "ஊக்கம்",
              love: "அன்பு",
              memes: "மீம்ஸ்",
              festival: "திருவிழா",
            },
          },
        },
        common: {
          english: "English",
          tamil: "தமிழ்",
          chooseLocation: "இடத்தை தேர்வு செய்க",
        },
      },
    },
  },

  lng: localStorage.getItem("lang") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  debug: true,
});

export default i18n;