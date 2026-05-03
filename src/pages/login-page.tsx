import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  Clock3,
  MapPin,
  Newspaper,
  PlayCircle,
  Radio,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Timer,
} from "lucide-react";

import logo from "../assets/Name.png";
import { getProfileByPhone, setAuthUser } from "@/utils/authStorage";

type LoginStep = "phone" | "otp";

const DEMO_OTP = "123456";

function cleanPhone(value: string) {
  return value.replace(/[^0-9]/g, "").slice(0, 10);
}

function cleanOtp(value: string) {
  return value.replace(/[^0-9]/g, "").slice(0, 6);
}

export default function LoginPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<LoginStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const isPhoneValid = phone.length === 10;
  const isOtpValid = otp.length === 6;

  const maskedPhone = useMemo(() => {
    if (!phone) return "";
    return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
  }, [phone]);

  function handleSendOtp() {
    if (!isPhoneValid) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    setError("");
    setIsSending(true);

    window.setTimeout(() => {
      setIsSending(false);
      setStep("otp");
    }, 400);
  }

  function handleVerifyOtp() {
    if (!isOtpValid) {
      setError("Enter the 6-digit OTP.");
      return;
    }

    if (otp !== DEMO_OTP) {
      setError("Invalid OTP. Use 123456 for demo login.");
      return;
    }

    const existingProfile = getProfileByPhone(phone);
    const profileCompleted = Boolean(existingProfile?.profileCompleted);

    setAuthUser({
      phone,
      profileCompleted,
      loggedInAt: new Date().toISOString(),
    });

    if (profileCompleted) {
      navigate("/");
      return;
    }

    navigate("/profile-settings");
  }

  function handleChangeNumber() {
    setStep("phone");
    setOtp("");
    setError("");
  }

  return (
    <main className="min-h-screen w-screen overflow-hidden bg-white text-[#18212f]">
      <section className="grid min-h-screen w-screen grid-cols-1 lg:grid-cols-[700px_minmax(0,1fr)]">
        {/* LEFT LOGIN FORM */}
        <section className="relative z-10 flex min-h-screen w-full items-center justify-center bg-white px-5 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-[490px]">
            <div className="mb-10">
              <img
                src={logo}
                alt="Just Go Real"
                className="h-auto w-[260px] object-contain"
              />

              <div className="mt-10 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-[#ef4b2b] ring-1 ring-orange-100">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure OTP Login
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-[#18212f]">
                {step === "phone" ? "Welcome back" : "Verify OTP"}
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {step === "phone"
                  ? "Login with your mobile number to continue reading local news and real videos."
                  : `Enter the 6-digit OTP sent to +91 ${maskedPhone}.`}
              </p>
            </div>

            <div className="space-y-5">
              {step === "phone" ? (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Phone Number
                    </label>

                    <div className="flex h-14 items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition focus-within:border-[#ef4b2b] focus-within:ring-4 focus-within:ring-orange-100">
                      <div className="flex h-full items-center gap-2 border-r border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-700">
                        <Smartphone className="h-4 w-4 text-slate-400" />
                        +91
                      </div>

                      <input
                        value={phone}
                        onChange={(event) => {
                          setPhone(cleanPhone(event.target.value));
                          setError("");
                        }}
                        type="tel"
                        inputMode="numeric"
                        placeholder="98765 43210"
                        className="min-w-0 flex-1 bg-transparent px-4 text-base font-bold text-slate-900 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 ring-1 ring-red-100">
                      {error}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!isPhoneValid || isSending}
                    className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#ef4b2b] px-5 text-sm font-black text-white shadow-xl shadow-orange-200 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
                  >
                    {isSending ? "Sending OTP..." : "Send OTP"}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="block text-sm font-bold text-slate-700">
                        OTP Code
                      </label>

                      <button
                        type="button"
                        onClick={handleChangeNumber}
                        className="text-xs font-black text-[#ef4b2b] hover:text-orange-700"
                      >
                        Change number
                      </button>
                    </div>

                    <input
                      value={otp}
                      onChange={(event) => {
                        setOtp(cleanOtp(event.target.value));
                        setError("");
                      }}
                      inputMode="numeric"
                      placeholder="Enter OTP"
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-center text-xl font-black tracking-[0.35em] text-slate-900 shadow-sm outline-none transition placeholder:text-base placeholder:font-semibold placeholder:tracking-normal placeholder:text-slate-400 focus:border-[#ef4b2b] focus:ring-4 focus:ring-orange-100"
                    />

                    <div className="mt-3 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-xs ring-1 ring-slate-100">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-500">
                        <Timer className="h-3.5 w-3.5" />
                        00:29
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setOtp("");
                          setError("");
                        }}
                        className="inline-flex items-center gap-1 font-black text-[#ef4b2b]"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Resend OTP
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 ring-1 ring-red-100">
                      {error}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={!isOtpValid}
                    className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#ef4b2b] px-5 text-sm font-black text-white shadow-xl shadow-orange-200 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
                  >
                    Verify & Continue
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </button>
                </>
              )}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                  <div>
                    <p className="text-sm font-black text-slate-800">
                      Demo OTP: 123456
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      First-time users will be redirected to profile setup.
                    </p>
                  </div>
                </div>
              </div>
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
                <Radio className="h-4 w-4 text-orange-200" />
                Live Local Updates
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white/80 ring-1 ring-white/15 backdrop-blur">
                <MapPin className="h-4 w-4 text-orange-200" />
                Tamil Nadu
              </div>
            </div>

            <div className="max-w-3xl">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#ef4b2b] px-4 py-2 text-sm font-black uppercase tracking-wide text-white">
                <Newspaper className="h-4 w-4" />
                Just Go Real News
              </p>

              <h2 className="text-6xl font-black leading-[1.02] tracking-tight text-white xl:text-7xl">
                Local news.
                <br />
                Real videos.
                <br />
                Faster updates.
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
                Stay connected with verified local stories, breaking alerts,
                trending videos, civic updates, and city-wise news from your
                area.
              </p>
            </div>

            <div className="grid max-w-4xl grid-cols-3 gap-5">
              <div className="rounded-[2rem] bg-white/10 p-5 ring-1 ring-white/10 backdrop-blur">
                <BellRing className="mb-5 h-7 w-7 text-orange-200" />
                <p className="text-lg font-black text-white">Breaking Alerts</p>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  Instant updates from your selected city.
                </p>
              </div>

              <div className="rounded-[2rem] bg-white/10 p-5 ring-1 ring-white/10 backdrop-blur">
                <PlayCircle className="mb-5 h-7 w-7 text-orange-200" />
                <p className="text-lg font-black text-white">Real Videos</p>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  Watch verified local video reports.
                </p>
              </div>

              <div className="rounded-[2rem] bg-white/10 p-5 ring-1 ring-white/10 backdrop-blur">
                <Clock3 className="mb-5 h-7 w-7 text-orange-200" />
                <p className="text-lg font-black text-white">Daily Feed</p>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  Personalized news after profile setup.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}