"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CreateAuctionModal } from "@/features/auctions/components/CreateAuctionModal";
import { useMyAuctions } from "@/features/auctions/hooks/useAuctions";
import AuctionsTable from "@/features/auctions/components/AuctionsTable";

const MyListingsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useMyAuctions(page);

  return (
    <div className="w-full px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#191919]">Moje aukcije</h1>
          <p className="text-sm text-[#666666] mt-1">
            Upravljajte i pratite svoje aukcije
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          size="default"
          className="bg-[#0a66c2] hover:bg-[#004182] active:bg-[#004182]"
        >
          <PlusIcon />
          Napravi aukciju
        </Button>
      </div>

      <AuctionsTable
        page={page}
        data={data}
        isLoading={isLoading}
        isError={isError}
        setPage={setPage}
      />

      <CreateAuctionModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default MyListingsPage;
