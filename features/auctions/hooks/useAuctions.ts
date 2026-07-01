import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { auctionApi } from "@/features/auctions/api/auction.api";
import {
  CreateAuctionRequest,
  PlaceBidRequest,
} from "@/features/auctions/types";

export const auctionKeys = {
  myAuctions: (page: number, limit: number) =>
    ["auctions", "my", { page, limit }] as const,

  allAuctions: (page: number, limit: number) =>
    ["auctions", "all", { page, limit }] as const,

  auction: (id: string) => ["auctions", id] as const,
};

export function useGetAllAuctions(page = 1, limit = 10) {
  return useQuery({
    queryKey: auctionKeys.allAuctions(page, limit),
    queryFn: () => auctionApi.getAll(page, limit),
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useMyAuctions(page = 1, limit = 10) {
  return useQuery({
    queryKey: auctionKeys.myAuctions(page, limit),
    queryFn: () => auctionApi.getMyAuctions(page, limit),
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useGetAuction(id: string) {
  return useQuery({
    queryKey: auctionKeys.auction(id),
    queryFn: () => auctionApi.getById(id),
    staleTime: 60 * 1000,
    enabled: !!id,
  });
}

export function useCreateAuction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FormData) => auctionApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auctions", "my"] });
      queryClient.invalidateQueries({ queryKey: ["auctions", "all"] });
      toast.success("Auction created successfully!");
    },
    onError: () => {
      toast.error("Failed to create auction. Please try again.");
    },
    throwOnError: false,
  });
}

export function usePlaceBid(auctionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PlaceBidRequest) =>
      auctionApi.placeBid(auctionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: auctionKeys.auction(auctionId),
      });
      queryClient.invalidateQueries({
        queryKey: ["auctions", auctionId, "bids"],
      });
      toast.success("Bid placed successfully!");
    },
    onError: () => {
      toast.error("Failed to place bid. Please try again.");
    },
    throwOnError: false,
  });
}
