import { GavelIcon, UserIcon } from "lucide-react";

import { DataTable, ColumnDef } from "@/components/ui/table/DataTable";
import { Bid } from "@/features/auctions/types";

function formatPrice(value: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

const columns: ColumnDef<Bid>[] = [
  {
    key: "bidder",
    header: "Kupac",
    render: (bid: Bid, index: number) => (
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-[#0a66c2]/10 flex items-center justify-center shrink-0">
          <UserIcon className="size-3.5 text-[#0a66c2]" />
        </div>
        <span className="font-medium text-[#191919]">
          {bid.bidder?.firstName}
        </span>
        {index === 0 && (
          <span className="ml-1 text-xs bg-[#0a66c2] text-white px-2 py-0.5 rounded-full font-medium">
            Najviša
          </span>
        )}
      </div>
    ),
  },
  {
    key: "amount",
    header: "Ponuda",
    render: (bid: Bid) => (
      <span className="font-semibold text-[#191919]">
        ${formatPrice(bid.amount)}
      </span>
    ),
  },
  {
    key: "createdAt",
    header: "Vreme",
    className: "hidden sm:table-cell",
    render: (bid: Bid) =>
      new Date(bid.createdAt).toLocaleString("sr-RS", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
];

interface AuctionBidHistoryProps {
  bids: Bid[];
}

export function AuctionBidHistory({ bids }: AuctionBidHistoryProps) {
  return (
    <div>
      <h2 className="text-lg font-bold text-[#191919] mb-4">Istorija ponuda</h2>
      {bids.length === 0 ? (
        <div className="rounded-xl border border-[#e0e0e0] bg-white flex flex-col items-center justify-center py-12 gap-2 text-center">
          <GavelIcon className="size-8 text-[#c2c2c2]" />
          <p className="text-[#666666] text-sm font-medium">
            Još uvek nema ponuda
          </p>
          <p className="text-[#999] text-xs">
            Budite prvi koji će postaviti ponudu!
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={bids}
          keyExtractor={(bid) => bid.id}
        />
      )}
    </div>
  );
}
