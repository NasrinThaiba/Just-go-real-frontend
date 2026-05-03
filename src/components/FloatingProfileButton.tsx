import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, LogOut, UserRound } from "lucide-react";

import {
  getAuthUser,
  getProfileByPhone,
  logoutUser,
  saveUserProfile,
  type UserProfile,
  type UserRole,
} from "@/utils/authStorage";

function getRoleLabel(role?: UserRole) {
  const roleMap: Record<UserRole, string> = {
    admin: "Admin",
    reportor: "Reportor",
    contributor: "Contributor",
    guest: "Guest",
  };

  if (!role) return "Guest";

  return roleMap[role];
}

function getProfileFallback(phone: string): UserProfile {
  const now = new Date().toISOString();

  return {
    phone,
    profileImage: "",
    name: "User",
    role: "guest",
    location: "Tenkasi",
    language: "en",
    profileCompleted: false,
    createdAt: now,
    updatedAt: now,
  };
}

export default function FloatingProfileButton() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const authUser = getAuthUser();

    if (!authUser?.phone) {
      setProfile(null);
      return;
    }

    const existingProfile = getProfileByPhone(authUser.phone);

    setProfile(existingProfile ?? getProfileFallback(authUser.phone));
  }, []);

  function handleChangeImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !profile) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const profileImage = String(reader.result);

      const updatedProfile: UserProfile = {
        ...profile,
        profileImage,
        updatedAt: new Date().toISOString(),
      };

      setProfile(updatedProfile);
      saveUserProfile(updatedProfile);
    };

    reader.readAsDataURL(file);
  }

  function handleLogout() {
    logoutUser();
    setOpen(false);
    navigate("/login");
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-50">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-lg shadow-slate-200/70 transition hover:scale-105"
      >
        {profile.profileImage ? (
          <img
            src={profile.profileImage}
            alt={profile.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <UserRound className="h-6 w-6 text-slate-500" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/80">
          <div className="bg-[#0f2747] px-4 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound className="h-7 w-7 text-white/70" />
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-black">
                  {profile.name || "User"}
                </p>

                <p className="mt-1 w-fit rounded-full bg-[#ef4b2b] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                  {getRoleLabel(profile.role)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 p-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-[#ef4b2b]">
              <Camera className="h-4 w-4" />
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
              className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-[#ef4b2b]"
            >
              <UserRound className="h-4 w-4" />
              Edit Profile
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm font-bold text-red-600 transition hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}