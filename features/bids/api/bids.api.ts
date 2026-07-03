import { api } from "@/lib/axios";
import { PlaceBidResult } from "../types";

export async function placeBid(
  auctionId: string,
  amount: number,
): Promise<PlaceBidResult> {
  const { data } = await api.post<PlaceBidResult>(
    `/auctions/${auctionId}/bids`,
    { amount },
  );
  return data;
}
