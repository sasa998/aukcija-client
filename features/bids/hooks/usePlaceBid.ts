import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { BidConflictError, PlaceBidResult } from "../types";
import { placeBid } from "../api/bids.api";
import { Auction } from "@/features/auctions/types";

export function usePlaceBid(auctionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) => placeBid(auctionId, amount),

    onSuccess: (result: PlaceBidResult) => {
      queryClient.invalidateQueries({
        queryKey: ["auctions", "all"],
        exact: false,
      });

      toast.success(
        result.wasExtended
          ? "Bid placed — auction extended!"
          : "Bid placed successfully",
      );
    },

    onError: (error: AxiosError<BidConflictError>) => {
      const status = error.response?.status;
      const body = error.response?.data;

      if (status === 409 && body) {
        // Someone beat us to it — sync to the real current price
        queryClient.setQueryData<Auction>(["auction", auctionId], (old) =>
          old ? { ...old, currentPrice: body.currentPrice } : old,
        );
        toast.error(`Too slow — minimum bid is now ${body.minAcceptable}`);
        return;
      }

      toast.error(body?.message ?? "Failed to place bid");
    },
  });
}
