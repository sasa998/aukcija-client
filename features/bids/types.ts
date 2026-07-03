export interface PlaceBidResult {
  auctionId: string;
  currentPrice: number;
  currentBidderId: string;
  bidCount: number;
  endsAt: string;
  wasExtended: boolean;
}

export interface BidConflictError {
  message: string;
  currentPrice: number;
  minAcceptable: number;
}
