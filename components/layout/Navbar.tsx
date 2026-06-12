"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/features/auth/hooks/useAuth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Tab = "auctions" | "my-listings";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname().slice(1);

  const user = useAuthStore((s) => s.user);
  const { mutate: logout } = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);

  function switchTab(tab: Tab) {
    router.push(`/${tab}`);
    setMenuOpen(false);
  }

  return (
    <nav className="bg-white border-b border-[#e0e0e0] sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 h-14 flex items-center gap-4 sm:gap-8">
        <Link
          href="/"
          className="flex items-center gap-2 flex-shrink-0 no-underline"
        >
          <div className="w-8 h-8 bg-[#0a66c2] rounded-[6px] flex items-center justify-center text-white text-base">
            🔨
          </div>
          <span className="text-lg font-bold text-[#0a66c2] tracking-tight">
            Aukcija
          </span>
        </Link>

        <div className="hidden sm:flex items-stretch h-14 flex-1">
          <button
            onClick={() => switchTab("auctions")}
            className={`flex items-center gap-1.5 px-4 text-[13px] font-medium border-b-2 transition-colors duration-150 cursor-pointer whitespace-nowrap select-none ${
              pathname === "auctions"
                ? "text-[#0a66c2] border-[#0a66c2] font-semibold"
                : "text-[#666666] border-transparent hover:text-[#191919]"
            }`}
          >
            <span className="text-base">🏷️</span>
            Aktivne aukcije
          </button>

          <button
            onClick={() => switchTab("my-listings")}
            className={`flex items-center gap-1.5 px-4 text-[13px] font-medium border-b-2 transition-colors duration-150 cursor-pointer whitespace-nowrap select-none ${
              pathname === "my-listings"
                ? "text-[#0a66c2] border-[#0a66c2] font-semibold"
                : "text-[#666666] border-transparent hover:text-[#191919]"
            }`}
          >
            <span className="text-base">📦</span>
            Moje aukcije
            {!user && <span className="text-[11px] opacity-60">🔒</span>}
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 ml-auto flex-shrink-0">
          {user ? (
            <>
              <span className="text-[13px] font-medium text-[#191919]">
                {user.firstName} {user.lastName}
              </span>
              <button
                onClick={() => logout()}
                className="px-4 py-[7px] rounded-full text-[13px] font-semibold cursor-pointer bg-transparent text-[#0a66c2] border border-[1.5px] border-[#0a66c2] hover:bg-[#e8f0fb] transition-colors duration-150"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-[7px] rounded-full text-[13px] font-semibold bg-transparent text-[#0a66c2] border border-[1.5px] border-[#0a66c2] hover:bg-[#e8f0fb] transition-colors duration-150"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-4 py-[7px] rounded-full text-[13px] font-semibold bg-[#0a66c2] text-white hover:bg-[#0958a8] transition-colors duration-150"
              >
                Join now
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger — Sheet overlay */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger
            className="sm:hidden ml-auto p-2 rounded-md text-[#666666] hover:text-[#191919] hover:bg-[#f3f2ef] transition-colors duration-150"
            aria-label="Toggle menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="17" y2="6" />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="14" x2="17" y2="14" />
            </svg>
          </SheetTrigger>

          <SheetContent side="right" className="w-72 p-0">
            <SheetHeader className="px-5 py-4 border-b border-[#e0e0e0]">
              <SheetTitle className="flex items-center gap-2 text-[#0a66c2]">
                <div className="w-7 h-7 bg-[#0a66c2] rounded-[6px] flex items-center justify-center text-white text-sm">
                  🔨
                </div>
                BidMarket
              </SheetTitle>
            </SheetHeader>

            <div className="px-3 py-3 flex flex-col gap-1">
              <button
                onClick={() => switchTab("auctions")}
                className={`flex items-center gap-2 px-3 py-3 rounded-md text-[14px] font-medium transition-colors duration-150 text-left w-full ${
                  pathname === "auctions"
                    ? "text-[#0a66c2] bg-[#e8f0fb] font-semibold"
                    : "text-[#666666] hover:text-[#191919] hover:bg-[#f3f2ef]"
                }`}
              >
                <span>🏷️</span>
                Auctions
              </button>
              <button
                onClick={() => switchTab("my-listings")}
                className={`flex items-center gap-2 px-3 py-3 rounded-md text-[14px] font-medium transition-colors duration-150 text-left w-full ${
                  pathname === "my-listings"
                    ? "text-[#0a66c2] bg-[#e8f0fb] font-semibold"
                    : "text-[#666666] hover:text-[#191919] hover:bg-[#f3f2ef]"
                }`}
              >
                <span>📦</span>
                My Listings
                {!user && (
                  <span className="text-[11px] opacity-60 ml-1">🔒</span>
                )}
              </button>
            </div>

            <div className="px-4 py-4 border-t border-[#e0e0e0] flex flex-col gap-2 mt-auto">
              {user ? (
                <>
                  <span className="text-[13px] font-medium text-[#191919] px-1 mb-1">
                    {user.firstName} {user.lastName}
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 rounded-full text-[13px] font-semibold cursor-pointer bg-transparent text-[#0a66c2] border border-[1.5px] border-[#0a66c2] hover:bg-[#e8f0fb] transition-colors duration-150"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-center px-4 py-2 rounded-full text-[13px] font-semibold bg-transparent text-[#0a66c2] border border-[1.5px] border-[#0a66c2] hover:bg-[#e8f0fb] transition-colors duration-150"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-center px-4 py-2 rounded-full text-[13px] font-semibold bg-[#0a66c2] text-white hover:bg-[#0958a8] transition-colors duration-150"
                  >
                    Join now
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
