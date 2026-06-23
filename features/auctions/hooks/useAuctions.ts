import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { auctionApi } from "@/features/auctions/api/auction.api";
import { CreateAuctionRequest } from "@/features/auctions/types";

export const auctionKeys = {
  myAuctions: (page: number, limit: number) =>
    ["auctions", "my", { page, limit }] as const,

  allAuctions: (page: number, limit: number) =>
    ["auctions", "all", { page, limit }] as const,
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

export function useCreateAuction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FormData) => auctionApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auctions", "my"] });
      toast.success("Auction created successfully!");
    },
    onError: () => {
      toast.error("Failed to create auction. Please try again.");
    },
    throwOnError: false,
  });
}
