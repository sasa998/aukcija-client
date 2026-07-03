import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getSocket } from "@/lib/socket";
import { Auction } from "@/features/auctions/types";
import { PaginatedResponse } from "@/lib/types";
import { auctionKeys } from "@/features/auctions/hooks/useAuctions";

interface BidPlacedPayload {
  auctionId: string;
  currentPrice: number;
  currentBidderId: string;
  bidCount: number;
  endsAt: string;
}

interface ExtendedPayload {
  auctionId: string;
  endsAt: string;
}

interface OutbidPayload {
  auctionId: string;
  newPrice: number;
}

export function useAuctionSocket(auctionIds: string[]) {
  const queryClient = useQueryClient();
  const idsKey = auctionIds.join(",");

  useEffect(() => {
    const ids = idsKey ? idsKey.split(",") : [];
    if (ids.length === 0) return;

    const socket = getSocket();
    socket.emit("joinAuctions", ids);

    function onBidPlaced(payload: BidPlacedPayload) {
      const { auctionId, currentPrice, endsAt } = payload;

      queryClient.setQueryData<Auction>(
        auctionKeys.auction(auctionId),
        (old) => (old ? { ...old, currentPrice, endsAt } : old),
      );

      queryClient.setQueriesData<PaginatedResponse<Auction>>(
        { queryKey: ["auctions", "all"], exact: false },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((a) =>
              a.id === auctionId ? { ...a, currentPrice, endsAt } : a,
            ),
          };
        },
      );
    }

    function onExtended(payload: ExtendedPayload) {
      const { auctionId, endsAt } = payload;

      queryClient.setQueryData<Auction>(
        auctionKeys.auction(auctionId),
        (old) => (old ? { ...old, endsAt } : old),
      );

      queryClient.setQueriesData<PaginatedResponse<Auction>>(
        { queryKey: ["auctions", "all"], exact: false },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((a) =>
              a.id === auctionId ? { ...a, endsAt } : a,
            ),
          };
        },
      );
    }

    function onOutbid(payload: OutbidPayload) {
      toast.warning(
        `Nadmašeni ste! Nova cena: BAM ${payload.newPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      );
    }

    socket.on("auction:bidPlaced", onBidPlaced);
    socket.on("auction:extended", onExtended);
    socket.on("auction:outbid", onOutbid);

    return () => {
      socket.emit("leaveAuctions", ids);
      socket.off("auction:bidPlaced", onBidPlaced);
      socket.off("auction:extended", onExtended);
      socket.off("auction:outbid", onOutbid);
    };
  }, [idsKey, queryClient]);
}
