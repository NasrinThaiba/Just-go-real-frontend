import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BellRing,
  Camera,
  CheckCircle2,
  Languages,
  MapPin,
  Newspaper,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

import logo from "@/assets/Name.png";

import {
  getAuthUser,
  getProfileByPhone,
  saveUserProfile,
  updateAuthProfileCompleted,
  type UserRole,
} from "@/utils/authStorage";

const roles: { label: string; value: UserRole }[] = [
  { label: "Admin", value: "admin" },
  { label: "Reportor", value: "reportor" },
  { label: "Contributor", value: "contributor" },
  { label: "Guest", value: "guest" },
];

export default function ProfileSettingsPage() {
  const navigate = useNavigate();

  const authUser = getAuthUser();
  const phone = authUser?.phone ?? "";
  const existingProfile = phone ? getProfileByPhone(phone) : null;

  const [profileImage, setProfileImage] = useState(
    existingProfile?.profileImage ?? ""
  );

  const [name, setName] = useState(existingProfile?.name ?? "");

  const [role, setRole] = useState<UserRole | "">(
    existingProfile?.role ?? ""
  );

  const [location, setLocation] = useState(
    existingProfile?.location ?? "Tenkasi"
  );

  const [language, setLanguage] = useState<"en" | "ta">(
    existingProfile?.language ?? "en"
  );

  const [error, setError] = useState("");

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
  }, [authUser, navigate]);

  function handleProfileImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid profile image.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfileImage(String(reader.result));
      setError("");
    };

    reader.readAsDataURL(file);
  }

  function handleSaveProfile() {
    if (!phone) {
      navigate("/login");
      return;
    }

    if (!profileImage) {
      setError("Upload your profile image.");
      return;
    }

    if (!name.trim()) {
      setError("Enter your name.");
      return;
    }

    if (!role) {
      setError("Select your role.");
      return;
    }

    const now = new Date().toISOString();

    saveUserProfile({
      phone,
      profileImage,
      name: name.trim(),
      role,
      location,
      language,
      profileCompleted: true,
      createdAt: existingProfile?.createdAt ?? now,
      updatedAt: now,
    });

    updateAuthProfileCompleted();

    navigate("/");
  }

  if (!authUser) {
    return null;
  }

  return (
    <main className="min-h-screen w-screen overflow-hidden bg-white text-[#18212f]">
      <section className="grid min-h-screen w-screen grid-cols-1 lg:grid-cols-[700px_minmax(0,1fr)]">
        {/* LEFT PROFILE FORM */}
        <section className="relative z-10 flex min-h-screen w-full items-center justify-center bg-white px-5 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-[390px]">
            <div className="mb-8">
              <img
                src={logo}
                alt="Just Go Real"
                className="h-auto w-[260px] object-contain"
              />

              <div className="mt-9 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-[#ef4b2b] ring-1 ring-orange-100">
                <ShieldCheck className="h-3.5 w-3.5" />
                Profile Setup
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-[#18212f]">
                Complete profile
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Add your profile image, name, and role to continue into the
                local news feed.
              </p>
            </div>

            <div className="space-y-5">
              {/* PROFILE IMAGE */}
              <div>
                <label className="mb-3 block text-sm font-bold text-slate-700">
                  Profile Image <span className="text-[#ef4b2b]">*</span>
                </label>

                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound className="h-9 w-9 text-slate-400" />
                    )}
                  </div>

                  <label className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 shadow-sm transition hover:border-[#ef4b2b] hover:text-[#ef4b2b]">
                    <Camera className="h-4 w-4" />
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* PHONE NUMBER */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Phone Number
                </label>

                <input
                  value={`+91 ${phone}`}
                  disabled
                  className="h-12 w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 text-sm font-bold text-slate-500 outline-none"
                />
              </div>

              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Name <span className="text-[#ef4b2b]">*</span>
                </label>

                <input
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError("");
                  }}
                  placeholder="Enter your name"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-[#ef4b2b] focus:ring-4 focus:ring-orange-100"
                />
              </div>

              {/* ROLE */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Role <span className="text-[#ef4b2b]">*</span>
                </label>

                <div className="relative">
                  <UsersRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <select
                    value={role}
                    onChange={(event) => {
                      setRole(event.target.value as UserRole);
                      setError("");
                    }}
                    className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-bold text-slate-700 shadow-sm outline-none focus:border-[#ef4b2b] focus:ring-4 focus:ring-orange-100"
                  >
                    <option value="">Select role</option>

                    {roles.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* LOCATION */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Location
                </label>

                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <select
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-bold text-slate-700 shadow-sm outline-none focus:border-[#ef4b2b] focus:ring-4 focus:ring-orange-100"
                  >
                    <option value="Tenkasi">Tenkasi</option>
                    <option value="Tirunelveli">Tirunelveli</option>
                    <option value="Madurai">Madurai</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Coimbatore">Coimbatore</option>
                  </select>
                </div>
              </div>

              {/* LANGUAGE */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Language
                </label>

                <div className="relative">
                  <Languages className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <select
                    value={language}
                    onChange={(event) =>
                      setLanguage(event.target.value as "en" | "ta")
                    }
                    className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-bold text-slate-700 shadow-sm outline-none focus:border-[#ef4b2b] focus:ring-4 focus:ring-orange-100"
                  >
                    <option value="en">English</option>
                    <option value="ta">Tamil</option>
                  </select>
                </div>
              </div>

              {error && (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 ring-1 ring-red-100">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleSaveProfile}
                className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#ef4b2b] text-sm font-black text-white shadow-xl shadow-orange-200 transition hover:bg-orange-700"
              >
                Save & Continue
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT NEWS BACKGROUND */}
        <section className="relative hidden min-h-screen overflow-hidden bg-[#071f3d] lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,75,43,0.45),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,180,80,0.25),transparent_34%),linear-gradient(135deg,#071f3d_0%,#102f55_48%,#08182d_100%)]" />

          <div className="absolute inset-0 opacity-[0.08]">
            <div className="grid h-full grid-cols-6 gap-4 p-8">
              {Array.from({ length: 36 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white bg-white/20"
                />
              ))}
            </div>
          </div>

          <div className="relative z-10 flex min-h-screen flex-col justify-between p-12 xl:p-16">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/15 backdrop-blur">
                <Newspaper className="h-4 w-4 text-orange-200" />
                Just Go Real
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white/80 ring-1 ring-white/15 backdrop-blur">
                <MapPin className="h-4 w-4 text-orange-200" />
                Tamil Nadu
              </div>
            </div>

            <div className="max-w-3xl">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#ef4b2b] px-4 py-2 text-sm font-black uppercase tracking-wide text-white">
                <UserRound className="h-4 w-4" />
                First Time Setup
              </p>

              <h2 className="text-6xl font-black leading-[1.02] tracking-tight text-white xl:text-7xl">
                Build your
                <br />
                local news
                <br />
                identity.
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
                Your profile helps personalize local alerts, video updates,
                breaking stories, and role-based features inside the platform.
              </p>
            </div>

            <div className="grid max-w-4xl grid-cols-3 gap-5">
              <div className="rounded-[2rem] bg-white/10 p-5 ring-1 ring-white/10 backdrop-blur">
                <UserRound className="mb-5 h-7 w-7 text-orange-200" />
                <p className="text-lg font-black text-white">Profile</p>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  Add your display photo.
                </p>
              </div>

              <div className="rounded-[2rem] bg-white/10 p-5 ring-1 ring-white/10 backdrop-blur">
                <UsersRound className="mb-5 h-7 w-7 text-orange-200" />
                <p className="text-lg font-black text-white">Role</p>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  Admin, reportor, contributor, or guest.
                </p>
              </div>

              <div className="rounded-[2rem] bg-white/10 p-5 ring-1 ring-white/10 backdrop-blur">
                <BellRing className="mb-5 h-7 w-7 text-orange-200" />
                <p className="text-lg font-black text-white">Alerts</p>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  Better local notifications.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white/10 p-5 ring-1 ring-white/10 backdrop-blur">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />

                <p className="text-sm leading-6 text-white/70">
                  Profile image, name, and role are mandatory for first-time
                  users. Location and language improve news personalization.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}