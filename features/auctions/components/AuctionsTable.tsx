"use client";

import { useRouter } from "next/navigation";
import { DataTable, ColumnDef } from "@/components/ui/table/DataTable";
import { CountdownTimer } from "@/features/auctions/components/CountdownTimer";
import { useMyAuctions } from "@/features/auctions/hooks/useAuctions";
import { Auction, AuctionStatus } from "@/features/auctions/types";

const statusStyles: Record<AuctionStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  ENDED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-700",
  PENDING: "bg-yellow-100 text-yellow-700",
};

const columns: ColumnDef<Auction>[] = [
  {
    key: "seller",
    header: "Prodavac",
    render: (row) => (
      <span className="font-medium text-[#191919]">
        {row.seller?.firstName || ""}
      </span>
    ),
  },
  {
    key: "title",
    header: "Ime",
    render: (row) => (
      <span className="font-medium text-[#191919]">{row.title}</span>
    ),
  },
  {
    key: "startingPrice",
    header: "Početna cena",
    render: (row) => (
      <span>
        $
        {row.startingPrice.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}
      </span>
    ),
    className: "hidden sm:table-cell",
  },
  {
    key: "currentPrice",
    header: "Najviša ponuda",
    render: (row) => (
      <span className="font-medium">
        $
        {row.currentPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </span>
    ),
  },
  {
    key: "buyoutPrice",
    header: "Cena otkupa",
    render: (row) =>
      row.buyoutPrice ? (
        <span>
          $
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
      <span className={` font-medium ${statusStyles[row.status]}`}>
        {/* {row.status.charAt(0) + row.status.slice(1).toLowerCase()} */}
        {/* Finish later when be add endpoint */}
        Active
      </span>
    ),
  },
  {
    key: "createdAt",
    header: "Kreirano",
    render: (row) => (
      <span className="text-[#666666]">
        {new Date(row.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    ),
    className: "hidden lg:table-cell",
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
];

interface Props {
  page: number;
  data: ReturnType<typeof useMyAuctions>["data"];
  isLoading: boolean;
  isError: boolean;
  setPage: (page: number) => void;
}

const AuctionsTable = ({ page, data, isLoading, isError, setPage }: Props) => {
  const router = useRouter();

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
    </>
  );
};

export default AuctionsTable;
