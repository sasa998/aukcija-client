export type AuctionStatus = "ACTIVE" | "ENDED" | "CANCELLED" | "PENDING";

type Seller = {
  firstName: string;
};

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
  seller: Seller;
}

export interface CreateAuctionRequest {
  title: string;
  description: string;
  startingPrice: number;
  buyoutPrice?: number;
}
