import React from "react";
import { type NewsPostPayload } from "../types/news";
import NewsButton from "./NewsButton";
import logo from "../assets/logo.png";
import { getTimeAgo } from "@/helper/getTimeAgo"; 

type Props = {
  item: NewsPostPayload;
  onClick?: () => void;
};

const NormalNews: React.FC<Props> = ({ item, onClick }) => {
  return (
    <article
  onClick={onClick}
  className="flex h-full cursor-pointer flex-col overflow-hidden transition hover:scale-[1.01]"
>
  <div className="space-y-2">
    {/* NEWS IMAGE ONLY */}
    {item.mediaUrl ? (
      <img
        src={item.mediaUrl}
        alt={item.title}
        className="h-[170px] w-full rounded-sm object-cover sm:h-[180px] md:h-[180px]"
      />
    ) : (
      <div className="flex h-[170px] w-full items-center justify-center rounded-md bg-muted text-sm text-muted-foreground sm:h-[180px] md:h-[180px]">
        No image available
      </div>
    )}
  </div>

  <div className="flex flex-1 flex-col pt-3">
    <h3 className="line-clamp-2 text-[14px] font-semibold leading-normal text-foreground sm:text-[15px] md:text-[16px]">
      {item.title}
    </h3>

    <div
      className="mt-auto pb-3 pt-2"
      onClick={(event) => event.stopPropagation()}
    >
      <NewsButton
        name={item.author.name}
        time={getTimeAgo(item.createdAt)}
        logo={item.author.avatar || logo}
        views={item.views}
        initialLikedCount={item.likes}
        initialCommentCount={item.comments?.length || 0}
        initialShareCount={item.shares}
        shareTitle={item.title}
        shareUrl={`${window.location.origin}/news/${item.id}`}
        onLike={(liked) => console.log(liked)}
        onComment={(comment) => console.log(comment)}
        onShare={() => console.log("shared")}
      />
    </div>
  </div>
</article>
  );
};

export default NormalNews;