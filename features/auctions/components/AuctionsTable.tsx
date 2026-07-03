"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, ColumnDef } from "@/components/ui/table/DataTable";
import { CountdownTimer } from "@/features/auctions/components/CountdownTimer";
import { useMyAuctions } from "@/features/auctions/hooks/useAuctions";
import { Auction, AuctionStatus } from "@/features/auctions/types";
import CategoryIcon from "./CategoryIcon";
import { MappedStatus } from "@/lib/utils";
import { Circle } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { BidModal } from "../../bids/components/BidModal";
import { useAuctionSocket } from "@/features/auctions/hooks/useAuctionSocket";
import { useAuthStore } from "@/store/authStore";

const statusStyles: Record<AuctionStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  ENDED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-700",
  NO_SALE: "bg-yellow-100 text-yellow-700",
};

interface Props {
  page: number;
  data: ReturnType<typeof useMyAuctions>["data"];
  isLoading: boolean;
  isError: boolean;
  setPage: (page: number) => void;
}

const AuctionsTable = ({ page, data, isLoading, isError, setPage }: Props) => {
  const user = useAuthStore((s) => s.user);

  const router = useRouter();
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);

  const auctionIds = data?.data.map((a) => a.id) ?? [];
  useAuctionSocket(auctionIds);

  const columns: ColumnDef<Auction>[] = [
    {
      key: "title",
      header: "Predmet",
      render: (row) => (
        <div className="flex items-center gap-2">
          <CategoryIcon categoryId={row.category ?? ""} />
          <div className="flex flex-col">
            <span className="font-medium text-[#191919]">{row.title}</span>
            <span className="text-[#666666] text-[13px]">
              {
                CATEGORIES.find((category) => category.id === row.category)
                  ?.name
              }
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "startingPrice",
      header: "Trenutna ponuda",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span className="font-bold">
            BAM{" "}
            {row.currentPrice.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </span>
          <span className=" text-[#666666] text-[12px]">
            Početna: BAM{" "}
            {row.startingPrice.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
      ),
      className: "hidden sm:table-cell",
    },
    {
      key: "bidsCount",
      header: "Broj ponuda",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span className="font-bold">⚡ {row.bidCount ?? 0}</span>
        </div>
      ),
      className: "hidden sm:table-cell",
    },
    {
      key: "buyoutPrice",
      header: "Cena otkupa",
      render: (row) =>
        row.buyoutPrice ? (
          <span className="font-bold">
            BAM{" "}
            {row.buyoutPrice.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </span>
        ) : (
          <span className="text-[#999]">—</span>
        ),
      className: "hidden md:table-cell",
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <div
          className={`flex items-center justify-center gap-2 md:w-[100px] font-medium ${statusStyles[row.status]} px-2 py-1 rounded-md text-[12px]`}
        >
          <Circle
            size={7}
            className={`${row.status === "ACTIVE" ? "text-green-500" : "text-gray-400"}`}
            fill={row.status === "ACTIVE" ? "currentColor" : "none"}
          />
          <span>{MappedStatus(row.status)}</span>
        </div>
      ),
    },
    {
      key: "endsAt",
      header: "Završava u",
      render: (row) =>
        row.endsAt ? (
          <CountdownTimer endsAt={row.endsAt} />
        ) : (
          <span className="text-[#999]">—</span>
        ),
      className: "hidden sm:table-cell",
    },
    {
      key: "",
      header: "",
      render: (row) => (
        <>
          {user?.id !== row?.sellerId && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAuction(row);
              }}
              className="bg-[#0a66c2] hover:bg-[#004182] active:bg-[#004182] rounded-4xl text-white text-[13px] px-4 py-1"
            >
              Licitiraj
            </Button>
          )}
        </>
      ),
      className: "hidden sm:table-cell",
    },
  ];

  return (
    <>
      {isError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load auctions. Please refresh and try again.
        </div>
      )}

      {isLoading ? (
        <div className="rounded-lg border border-[#e0e0e0] bg-white">
          <div className="flex items-center justify-center py-16 text-[#666666]">
            Učitavanje aukcija...
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          keyExtractor={(row) => row.id}
          emptyMessage="Trenutno  ne postoje aukcije."
          onRowClick={(row) => router.push(`/auctions/${row.id}`)}
          pagination={
            data?.meta
              ? { meta: data.meta, currentPage: page, onPageChange: setPage }
              : undefined
          }
        />
      )}

      {selectedAuction && (
        <BidModal
          open={!!selectedAuction}
          onOpenChange={(open) => {
            if (!open) setSelectedAuction(null);
          }}
          auction={selectedAuction}
        />
      )}
    </>
  );
};

export default AuctionsTable;
