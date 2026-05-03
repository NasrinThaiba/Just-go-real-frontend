import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  label: string;   // text shown on hover
  route: string;   // where to navigate
};

export default function FloatingAddButton({ label, route }: Props) {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 right-6 z-50 group flex items-center">

      {/* TEXT */}
      <span
        className="
          mr-3
          rounded-md bg-popover text-popover-foreground
          border border-border px-3 py-1 text-sm whitespace-nowrap
          shadow-md
          opacity-0 translate-x-2
          transition-all duration-200
          group-hover:opacity-100 group-hover:translate-x-0
        "
      >
        {label}
      </span>

      {/* BUTTON */}
      <button
        onClick={() => navigate(route)}
        className="
          flex items-center justify-center
          h-14 w-14 rounded-full
          bg-accent text-accent-foreground
          border border-border
          shadow-xl
          transition-all duration-200
          hover:scale-110 hover:shadow-2xl
          active:scale-95
          focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        "
        aria-label={label}
      >
        <Plus size={24} />
      </button>
    </div>
  );
}