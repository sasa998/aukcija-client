"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/FormInput";
import { FormAlert } from "@/components/ui/FormAlert";
import { Auction } from "@/features/auctions/types";
import { usePlaceBid } from "@/features/bids/hooks/usePlaceBid";

const bidSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
      message: "Amount must be a positive number",
    }),
});

type BidFormValues = z.infer<typeof bidSchema>;

interface BidModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auction: Auction;
}

export function BidModal({ open, onOpenChange, auction }: BidModalProps) {
  const { mutate: placeBid, isPending, error } = usePlaceBid(auction.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BidFormValues>({
    resolver: zodResolver(bidSchema),
    defaultValues: { amount: String(auction.currentPrice + 1) },
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = (values: BidFormValues) => {
    placeBid(Number(values.amount), { onSuccess: handleClose });
  };

  const minBid = auction.currentPrice + 0.01;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity duration-200" />
        <DialogPrimitive.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl outline-none data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 transition-all duration-200">
          <div className="flex items-center justify-between border-b border-[#e0e0e0] px-6 py-4">
            <DialogPrimitive.Title className="text-lg font-semibold text-[#191919]">
              Postavi ponudu
            </DialogPrimitive.Title>
            <button
              onClick={handleClose}
              className="rounded-md p-1 text-[#666666] hover:bg-[#f3f2ef] hover:text-[#191919] transition-colors"
            >
              <XIcon className="size-4" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 py-5 space-y-4"
          >
            <div className="rounded-lg bg-[#f3f2ef] px-4 py-3 space-y-1">
              <p className="text-xs text-[#666666] font-medium uppercase tracking-wide">
                Aukcija
              </p>
              <p className="font-semibold text-[#191919] truncate">
                {auction.title}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-[#e0e0e0] px-3 py-2">
                <p className="text-[#666666] text-xs mb-0.5">Trenutna cena</p>
                <p className="font-semibold text-[#191919]">
                  BAM{" "}
                  {auction.currentPrice.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="rounded-lg border border-[#e0e0e0] px-3 py-2">
                <p className="text-[#666666] text-xs mb-0.5">Min. ponuda</p>
                <p className="font-semibold text-[#0a66c2]">
                  BAM{" "}
                  {minBid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <FormInput
              id="bid-amount"
              label="Vaša ponuda (BAM)"
              type="number"
              step="0.01"
              min={minBid}
              {...register("amount")}
              error={errors.amount?.message}
              placeholder={`Minimum $${minBid.toFixed(2)}`}
            />

            {error && (
              <FormAlert
                message={
                  (error as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ?? "Failed to place bid."
                }
              />
            )}

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={isPending}
              >
                Otkaži
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#0a66c2] hover:bg-[#004182]"
                disabled={isPending}
              >
                {isPending ? "Postavljanje..." : "Potvrdi ponudu"}
              </Button>
            </div>
          </form>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
