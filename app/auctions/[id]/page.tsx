"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, UserIcon, CalendarIcon } from "lucide-react";

import { useGetAuction } from "@/features/auctions/hooks/useAuctions";
import { AuctionImageGallery } from "@/features/auctions/components/AuctionImageGallery";
import { AuctionPriceCard } from "@/features/auctions/components/AuctionPriceCard";
import { AuctionBidHistory } from "@/features/auctions/components/AuctionBidHistory";
import { BidModal } from "@/features/auctions/components/BidModal";

function AuctionDetailSkeleton() {
  return (
    <div className="w-full px-4 sm:px-6 py-8 max-w-6xl mx-auto animate-pulse">
      <div className="h-6 w-32 bg-[#e0e0e0] rounded mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="aspect-video bg-[#e0e0e0] rounded-xl" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-[#e0e0e0] rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-8 bg-[#e0e0e0] rounded w-3/4" />
          <div className="h-4 bg-[#e0e0e0] rounded w-1/2" />
          <div className="h-24 bg-[#e0e0e0] rounded" />
          <div className="h-40 bg-[#e0e0e0] rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function AuctionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [isBidModalOpen, setIsBidModalOpen] = useState(false);

  const { data: auction, isLoading, isError } = useGetAuction(id);

  if (isLoading) return <AuctionDetailSkeleton />;

  if (isError || !auction) {
    return (
      <div className="w-full px-4 sm:px-6 py-8 max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[#666666] hover:text-[#191919] transition-colors mb-6"
        >
          <ArrowLeftIcon className="size-4" />
          Nazad
        </button>
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
          <p className="text-red-700 font-medium">Aukcija nije pronađena.</p>
          <p className="text-red-500 text-sm mt-1">
            Proverite link ili pokušajte ponovo.
          </p>
        </div>
      </div>
    );
  }

  const images = auction.images ?? [];

  return (
    <div className="w-full px-4 sm:px-6 py-8 max-w-6xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-[#666666] hover:text-[#191919] transition-colors mb-6"
      >
        <ArrowLeftIcon className="size-4" />
        Nazad na aukcije
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <AuctionImageGallery
          images={images}
          title={auction.title}
          status={auction.status}
        />

        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-2xl font-bold text-[#191919] leading-tight">
              {auction.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#666666]">
              <span className="flex items-center gap-1.5">
                <UserIcon className="size-3.5" />
                {auction.seller?.firstName}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarIcon className="size-3.5" />
                {new Date(auction.createdAt).toLocaleDateString("sr-RS", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <p className="text-sm text-[#444] leading-relaxed">
            {auction.description}
          </p>

          <AuctionPriceCard
            auction={auction}
            onBidClick={() => setIsBidModalOpen(true)}
          />
        </div>
      </div>

      <AuctionBidHistory bids={auction.bids ?? []} />

      <BidModal
        open={isBidModalOpen}
        onOpenChange={setIsBidModalOpen}
        auction={auction}
      />
    </div>
  );
}
