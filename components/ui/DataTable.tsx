"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/Pagination";
import { PaginationMeta } from "@/lib/types";

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface PaginationConfig {
  meta: PaginationMeta;
  currentPage: number;
  onPageChange: (page: number) => void;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  pagination?: PaginationConfig;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No records found.",
  pagination,
}: DataTableProps<T>) {
  return (
    <div className="rounded-lg border border-[#e0e0e0] bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#f3f2ef] hover:bg-[#f3f2ef]">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={`text-[#666666] font-semibold text-xs uppercase tracking-wide ${col.className ?? ""}`}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-12 text-[#666666]"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow
                key={keyExtractor(row)}
                className="border-[#e0e0e0] hover:bg-[#f9f9f9]"
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className={`py-3 ${col.className ?? ""}`}
                  >
                    {col.render
                      ? col.render(row)
                      : String(
                          (row as Record<string, unknown>)[col.key] ?? "—",
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {pagination && (
        <div className="border-t border-[#e0e0e0]">
          <Pagination
            meta={pagination.meta}
            currentPage={pagination.currentPage}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}
    </div>
  );
}
