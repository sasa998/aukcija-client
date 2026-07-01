import { GavelIcon, TagIcon, TrendingUpIcon, ClockIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/features/auctions/components/CountdownTimer";
import { Auction } from "@/features/auctions/types";

function formatPrice(value: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

interface AuctionPriceCardProps {
  auction: Auction;
  onBidClick: () => void;
}

export function AuctionPriceCard({
  auction,
  onBidClick,
}: AuctionPriceCardProps) {
  const isActive = auction.status === "ACTIVE";

  return (
    <div className="rounded-xl border border-[#e0e0e0] bg-white overflow-hidden shadow-sm">
      <div className="bg-[#f3f2ef] px-4 py-3 border-b border-[#e0e0e0]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#666666]">
          Pregled cena
        </p>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[#666666]">
            <TagIcon className="size-3.5" />
            <span className="text-xs font-medium">Početna cena</span>
          </div>
          <p className="text-lg font-semibold text-[#191919]">
            ${formatPrice(auction.startingPrice)}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[#0a66c2]">
            <TrendingUpIcon className="size-3.5" />
            <span className="text-xs font-medium">Trenutna ponuda</span>
          </div>
          <p className="text-lg font-bold text-[#0a66c2]">
            ${formatPrice(auction.currentPrice)}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[#666666]">
            <GavelIcon className="size-3.5" />
            <span className="text-xs font-medium">Cena otkupa</span>
          </div>
          {auction.buyoutPrice ? (
            <p className="text-lg font-semibold text-[#191919]">
              ${formatPrice(auction.buyoutPrice)}
            </p>
          ) : (
            <p className="text-sm text-[#999]">—</p>
          )}
        </div>
      </div>

      {auction.endsAt && (
        <div className="border-t border-[#e0e0e0] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#666666]">
            <ClockIcon className="size-3.5" />
            <span className="text-xs font-medium">Završava za</span>
          </div>
          <CountdownTimer endsAt={auction.endsAt} />
        </div>
      )}

      {isActive && (
        <div className="border-t border-[#e0e0e0] px-4 py-4">
          <Button
            onClick={onBidClick}
            className="w-full bg-[#0a66c2] hover:bg-[#004182] active:bg-[#004182] h-10 text-sm font-semibold"
          >
            <GavelIcon className="size-4" />
            Postavi ponudu
          </Button>
        </div>
      )}
    </div>
  );
}
