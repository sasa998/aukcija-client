import { api } from "@/lib/axios";
import { Auction, Bid, CreateAuctionRequest, PlaceBidRequest } from "../types";
import { PaginatedResponse } from "@/lib/types";

export const auctionApi = {
  getAll: async (page = 1, limit = 20): Promise<PaginatedResponse<Auction>> => {
    const { data } = await api.get<PaginatedResponse<Auction>>("/auctions", {
      params: { page, limit },
    });
    return data;
  },

  getById: async (id: string): Promise<Auction> => {
    const { data } = await api.get<Auction>(`/auctions/${id}`);
    return data;
  },

  create: async (payload: FormData): Promise<Auction> => {
    const { data } = await api.post<Auction>("/auctions", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  getMyAuctions: async (
    page = 1,
    limit = 20,
  ): Promise<PaginatedResponse<Auction>> => {
    const { data } = await api.get<PaginatedResponse<Auction>>("/auctions/my", {
      params: { page, limit },
    });
    return data;
  },

  placeBid: async (
    auctionId: string,
    payload: PlaceBidRequest,
  ): Promise<Bid> => {
    const { data } = await api.post<Bid>(
      `/auctions/${auctionId}/bids`,
      payload,
    );
    return data;
  },
};
