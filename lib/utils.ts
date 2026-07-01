import { AuctionStatus } from "@/features/auctions/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const MappedAuctionStatus: Record<AuctionStatus, string> = {
  [AuctionStatus.ACTIVE]: "Aktivna",
  [AuctionStatus.ENDED]: "Završena",
  [AuctionStatus.CANCELLED]: "Otkazana",
  [AuctionStatus.NO_SALE]: "Bez prodaje",
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function MappedStatus(status: AuctionStatus) {
  switch (status) {
    case AuctionStatus.ACTIVE:
      return MappedAuctionStatus.ACTIVE;
    case AuctionStatus.ENDED:
      return MappedAuctionStatus.ENDED;
    case AuctionStatus.CANCELLED:
      return MappedAuctionStatus.CANCELLED;
    case AuctionStatus.NO_SALE:
      return MappedAuctionStatus.NO_SALE;
  }
}
