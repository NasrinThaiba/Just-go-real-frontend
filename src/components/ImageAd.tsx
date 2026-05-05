import { useEffect, useState } from "react";
import { X } from "lucide-react";

type ImageAdSize = "top" | "side" | "large" | "medium" | "home";

type ImageAdProps = {
  ads: string[];
  label?: string;
  size?: ImageAdSize;
  priority?: boolean;
  className?: string;
};

const AD_SIZE_CONFIG: Record<
  ImageAdSize,
  {
    wrapperClass: string;
    imageWidth: number;
    imageHeight: number;
  }
> = {
  top: {
    wrapperClass: "h-[200px] w-full max-w-[1088px]",
    imageWidth: 1088,
    imageHeight: 200,
  },
  side: {
    wrapperClass: "h-[600px] w-[160px]",
    imageWidth: 160,
    imageHeight: 600,
  },
  large: {
    wrapperClass: "h-[300px] w-full max-w-[320px]",
    imageWidth: 320,
    imageHeight: 300,
  },
  medium: {
    wrapperClass: "h-[250px] w-full max-w-[320px]",
    imageWidth: 320,
    imageHeight: 250,
  },
  home: {
    wrapperClass: "h-[260px] w-full",
    imageWidth: 300,
    imageHeight: 250,
  },
};

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();

    image.onload = () => resolve();
    image.onerror = () => resolve();

    image.src = src;
  });
}

export default function ImageAd({
  ads,
  label = "Advertisement",
  size = "medium",
  priority = false,
  className = "",
}: ImageAdProps) {
  const [adIndex, setAdIndex] = useState(0);
  const [isClosed, setIsClosed] = useState(false);
  const [isReady, setIsReady] = useState(priority ? false : true);

  const adSize = AD_SIZE_CONFIG[size];
  const currentAd = ads[adIndex];

  useEffect(() => {
    if (!ads.length) return;

    let active = true;

    async function preloadAds() {
      await Promise.all(ads.map((ad) => preloadImage(ad)));

      if (active) {
        setIsReady(true);
      }
    }

    preloadAds();

    return () => {
      active = false;
    };
  }, [ads]);

  useEffect(() => {
    if (isClosed || !isReady || ads.length <= 1) return;

    const interval = window.setInterval(() => {
      setAdIndex((currentIndex) => (currentIndex + 1) % ads.length);
    }, 10000);

    return () => {
      window.clearInterval(interval);
    };
  }, [ads.length, isClosed, isReady]);

  useEffect(() => {
    if (!ads.length) return;

    const nextIndex = (adIndex + 1) % ads.length;
    const nextImage = new Image();

    nextImage.src = ads[nextIndex];
  }, [adIndex, ads]);

  if (!ads.length) return null;

  return (
    <article
      className={`relative overflow-hidden border border-border bg-slate-100 shadow-sm ${adSize.wrapperClass} ${className}`}
    >
      {!isClosed ? (
        <>
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

          <div className="absolute left-3 top-3 z-10 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            Ad
          </div>

          {!isReady ? (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs font-semibold text-slate-400">
              Loading ad...
            </div>
          ) : (
            <a
              href="#"
              aria-label={label}
              className="block h-full w-full"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                key={currentAd}
                src={currentAd}
                alt={label}
                width={adSize.imageWidth}
                height={adSize.imageHeight}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : "auto"}
                decoding="async"
                sizes={`${adSize.imageWidth}px`}
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
              />
            </a>
          )}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs font-semibold text-slate-400">
          Advertisement closed
        </div>
      )}
    </article>
  );
}