export type AuctionStatus = "ACTIVE" | "ENDED" | "CANCELLED" | "PENDING";

export interface Auction {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  buyoutPrice?: number;
  currentPrice: number;
  status: AuctionStatus;
  createdAt: string;
  endsAt?: string;
}

export interface CreateAuctionRequest {
  title: string;
  description: string;
  startingPrice: number;
  buyoutPrice?: number;
}
