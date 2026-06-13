"use client";

import { useState } from "react";

import { useGetAllAuctions } from "@/features/auctions/hooks/useAuctions";
import AuctionsTable from "@/features/auctions/components/AuctionsTable";

const Auctions = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetAllAuctions(page);

  return (
    <div className="w-full px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#191919]">Auctions</h1>
        </div>
      </div>

      <AuctionsTable
        page={page}
        data={data}
        isLoading={isLoading}
        isError={isError}
        setPage={setPage}
      />
    </div>
  );
};

export default Auctions;
