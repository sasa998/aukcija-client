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
  images?: string[];
  bids?: Bid[];
}

export interface Bid {
  id: string;
  amount: number;
  createdAt: string;
  bidder: {
    firstName: string;
  };
}

export interface PlaceBidRequest {
  amount: number;
}

export interface CreateAuctionRequest {
  title: string;
  description: string;
  startingPrice: number;
  buyoutPrice?: number;
}
