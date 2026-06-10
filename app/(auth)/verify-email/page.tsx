"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

type Status = "verifying" | "success" | "error";
import { useState } from "react";
import { authApi } from "@/features/auth/api/auth.api";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>("verifying");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        await authApi.verifyEmail(token);

        setStatus("success");
        toast.success("Account verified!", {
          description: "Redirecting you to login…",
          position: "top-right",
        });

        setTimeout(() => router.push("/login"), 3000);
      } catch {
        setStatus("error");
        toast.error("Verification failed", {
          description: "This link may have expired or already been used.",
          position: "top-right",
        });
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a0f] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff18 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 20%, #0a0a0f 80%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-4 bg-[#13131a] border border-white/[0.07] rounded-2xl px-10 py-14 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]">
        {status === "verifying" && <VerifyingState />}
        {status === "success" && <SuccessState />}
        {status === "error" && <ErrorState hasToken={!!token} />}
      </div>
    </div>
  );
}

function VerifyingState() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="w-14 h-14 rounded-full border-[2.5px] border-white/10 border-t-violet-500 animate-spin mb-1" />
      <h1 className="text-2xl font-semibold text-white/90 tracking-tight">
        Verifying your account
      </h1>
      <p className="text-sm text-white/40 leading-relaxed max-w-[26ch]">
        Hold tight, this only takes a moment.
      </p>
    </div>
  );
}

function SuccessState() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="w-14 h-14 rounded-full flex items-center justify-center bg-emerald-950 border border-emerald-800/60 text-emerald-400 mb-1">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
          <path
            d="M7 16.5l6 6L25 10"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-white/90 tracking-tight">
        You&apos;re verified
      </h1>
      <p className="text-sm text-white/40 leading-relaxed max-w-[26ch]">
        Your account is now active. Redirecting you to login…
      </p>
    </div>
  );
}

function ErrorState({ hasToken }: { hasToken: boolean }) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="w-14 h-14 rounded-full flex items-center justify-center bg-red-950 border border-red-800/60 text-red-400 mb-1">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
          <path
            d="M10 10l12 12M22 10L10 22"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-white/90 tracking-tight">
        {hasToken ? "Link expired or invalid" : "No token found"}
      </h1>
      <p className="text-sm text-white/40 leading-relaxed max-w-[28ch]">
        {hasToken
          ? "This verification link may have expired or already been used."
          : "Please use the link from your verification email."}
      </p>
      <button
        onClick={() => router.push("/login")}
        className="mt-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:bg-white/10 hover:text-white/90 hover:border-white/20 transition-all duration-150 cursor-pointer"
      >
        Back to login
      </button>
    </div>
  );
}
