import { useEffect, useRef, useState } from "react";
import { Camera, LogOut, Pencil, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getAuthUser, getProfileByPhone, logoutUser, saveUserProfile } from "@/utils/authStorage";
import { getUserLogo } from "@/helper/getUserLogo";

export default function FloatingProfileButton() {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const authUser = getAuthUser();
  const profile = authUser?.phone ? getProfileByPhone(authUser.phone) : null;

  const [open, setOpen] = useState(false);
  const [logo, setLogo] = useState((profile as any)?.profileImage || (profile as any)?.logo || "");

  const userName = profile?.name || "User";
  const userRole = (profile as any)?.role || "Guest";

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!dropdownRef.current) return;

      if (!dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function handleChangeImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !authUser?.phone || !profile) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageUrl = String(reader.result);

      setLogo(imageUrl);

      saveUserProfile({
        ...(profile as any),
        profileImage: imageUrl,
        logo: imageUrl,
        updatedAt: new Date().toISOString(),
      });
    };

    reader.readAsDataURL(file);
  }

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  return (
    <div ref={dropdownRef} className="fixed right-4 top-4 z-[99999]">
      {/* PROFILE BUTTON */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="h-11 w-11 overflow-hidden rounded-full border-2 border-white bg-white shadow-lg ring-2 ring-black/10"
        aria-label="Open profile menu"
      >
        <img
          src={getUserLogo(logo)}
          alt="profile"
          className="h-full w-full object-cover"
        />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="fixed right-4 top-16 z-[99999] w-[320px] overflow-hidden rounded-[32px] border border-white/30 bg-[#10294a] text-white shadow-2xl">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close profile menu"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-4 p-6">
            <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-white/40 bg-white">
              <img
                src={getUserLogo(logo)}
                alt={userName}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-xl font-extrabold">{userName}</h3>

              <span className="mt-2 inline-flex rounded-full bg-[#ef4b2f] px-4 py-1 text-xs font-extrabold uppercase tracking-wide text-white">
                {userRole}
              </span>
            </div>
          </div>

          <div className="space-y-1 bg-white px-6 py-5 text-[#18212f]">
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition hover:bg-slate-100">
              <Camera className="h-5 w-5 text-[#10294a]" />
              Change Photo

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChangeImage}
              />
            </label>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/profile-settings");
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold transition hover:bg-slate-100"
            >
              <Pencil className="h-5 w-5 text-[#10294a]" />
              Edit Profile
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-extrabold text-red-600 transition hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}