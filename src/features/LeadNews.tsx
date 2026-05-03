import React from "react";
import NewsButton from "./NewsButton";
import { type NewsPostPayload } from "../types/news";
import { getTimeAgo } from "@/helper/getTimeAgo";

type Props = {
  item: NewsPostPayload;
  onClick?: () => void; // ✅ view + navigation handled in parent
};

const LeadNews: React.FC<Props> = ({ item, onClick }) => {
  return (
    <article
      onClick={onClick}
      className="flex h-full cursor-pointer flex-col overflow-hidden transition hover:scale-[1.01]"
    >
      <div className="h-[200px] w-full overflow-hidden sm:h-[200px] md:h-[250px] lg:h-[300px]">
        {item.mediaUrl ? (
          <img
            src={item.mediaUrl}
            alt={item.title}
            className="h-full w-full rounded-sm object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-sm bg-muted text-sm text-muted-foreground">
            No image available
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <h3 className="line-clamp-2 text-[15px] font-bold text-foreground sm:text-[18px] md:text-[20px]">
          {item.title}
        </h3>

        <p className="mt-3 line-clamp-6 text-[13px] leading-7 text-muted-foreground break-all sm:text-[14px] md:text-[16px]">
          {item.description}
        </p>

        <div
          className="mt-auto pb-3 pt-2"
          onClick={(event) => event.stopPropagation()}
        >
          <NewsButton
            name={item.author.name}
            time={getTimeAgo(item.createdAt)}
            logo={item.author.avatar}
            views={item.views}
            initialLikedCount={item.likes}
            initialCommentCount={item.comments.length}
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

export default LeadNews;