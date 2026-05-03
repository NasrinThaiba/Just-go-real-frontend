import { useEffect, useState } from "react";
import { X } from "lucide-react";

import card1 from "../ads/consdroid-home.png";
import card2 from "../ads/isha-home.png";
import card3 from "../ads/knowtron-home.png";
import card4 from "../ads/talky-home.png";
import card5 from "../ads/truprops-home.png";

const ads = [card1, card2, card3, card4, card5];

export default function Ads() {
  const [adIndex, setAdIndex] = useState(0);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    if (isClosed) return;

    const interval = window.setInterval(() => {
      setAdIndex((currentIndex) => (currentIndex + 1) % ads.length);
    }, 10000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isClosed]);

  const currentAd = ads[adIndex];

  return (
    <article className="group relative h-[220px] w-full overflow-hidden border border-border bg-card shadow-sm sm:h-[240px] md:h-[260px]">
      {!isClosed ? (
        <>
          {/* CLOSE BUTTON */}
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsClosed(true);
            }}
            className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white shadow-md transition hover:bg-red-600"
            aria-label="Close advertisement"
          >
            <X className="h-4 w-4" />
          </button>

          {/* AD LABEL */}
          <div className="absolute left-3 top-3 z-10 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            Ad
          </div>

          {/* AD IMAGE */}
          <a href="#" aria-label="Advertisement" className="block h-full w-full">
            <img
              key={currentAd}
              src={currentAd}
              alt="Advertisement"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </a>
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs font-semibold text-slate-400">
          Advertisement closed
        </div>
      )}
    </article>
  );
}