"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaginationMeta } from "@/lib/types";

interface PaginationProps {
  meta: PaginationMeta;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, currentPage, onPageChange }: PaginationProps) {
  const { totalPages, total, limit, hasPrev, hasNext } = meta;
  const page = currentPage;

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-3 text-sm text-[#666666]">
      <span>
        {total === 0
          ? "No results"
          : `Showing ${from}–${to} of ${total} result${total !== 1 ? "s" : ""}`}
      </span>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Prev
        </Button>

        <span className="px-3 py-1 rounded border border-[#e0e0e0] bg-white font-medium text-[#191919] text-xs">
          {page} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          aria-label="Next page"
        >
          Next
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
