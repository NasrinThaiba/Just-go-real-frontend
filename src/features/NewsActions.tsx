import { Heart, MessageCircle, Share2 } from "lucide-react";

type NewsActionsProps = {
  liked: boolean;
  likedCount: number;
  commentCount: number;
  shareCount: number;
  onLikeToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCommentClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onShareClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function NewsActions({
  liked,
  likedCount,
  commentCount,
  shareCount,
  onLikeToggle,
  onCommentClick,
  onShareClick,
}: NewsActionsProps) {
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      
      <button onClick={onLikeToggle} className="flex items-center gap-1">
        <Heart size={14} className={liked ? "fill-primary text-primary" : ""} />
        {likedCount}
      </button>

      <button onClick={onCommentClick} className="flex items-center gap-1">
        <MessageCircle size={14} />
        {commentCount}
      </button>

      <button onClick={onShareClick} className="flex items-center gap-1">
        <Share2 size={14} />
        {shareCount}
      </button>

    </div>
  );
}