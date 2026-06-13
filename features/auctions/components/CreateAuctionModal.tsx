"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/FormInput";
import { FormAlert } from "@/components/ui/FormAlert";
import { useCreateAuction } from "@/features/auctions/hooks/useAuctions";

const createAuctionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startingPrice: z
    .string()
    .min(1, "Starting price is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
      message: "Starting price must be a positive number",
    }),
  buyoutPrice: z
    .string()
    .optional()
    .refine((v) => !v || (!isNaN(Number(v)) && Number(v) > 0), {
      message: "Buyout price must be a positive number",
    }),
});

type CreateAuctionFormValues = z.infer<typeof createAuctionSchema>;

interface CreateAuctionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAuctionModal({
  open,
  onOpenChange,
}: CreateAuctionModalProps) {
  const { mutate: createAuction, isPending, error } = useCreateAuction();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAuctionFormValues>({
    resolver: zodResolver(createAuctionSchema),
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = (values: CreateAuctionFormValues) => {
    createAuction(
      {
        title: values.title,
        description: values.description,
        startingPrice: Number(values.startingPrice),
        buyoutPrice: values.buyoutPrice
          ? Number(values.buyoutPrice)
          : undefined,
      },
      {
        onSuccess: () => handleClose(),
      },
    );
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          className={cn(
            "fixed inset-0 z-50 bg-black/40 transition-opacity duration-150",
            "data-ending-style:opacity-0 data-starting-style:opacity-0",
            "supports-backdrop-filter:backdrop-blur-sm",
          )}
        />
        <DialogPrimitive.Popup
          className={cn(
            "fixed z-50 inset-x-4 top-1/2 -translate-y-1/2",
            "sm:left-1/2 sm:right-auto sm:w-full sm:max-w-lg sm:-translate-x-1/2",
            "bg-white rounded-xl shadow-xl",
            "p-6 flex flex-col gap-5",
            "max-h-[calc(100dvh-2rem)] overflow-y-auto",
            "transition duration-150",
            "data-ending-style:opacity-0 data-ending-style:scale-95",
            "data-starting-style:opacity-0 data-starting-style:scale-95",
          )}
        >
          <div className="flex items-center justify-between">
            <DialogPrimitive.Title className="text-lg font-semibold text-[#191919]">
              Create Auction
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              render={
                <Button variant="ghost" size="icon-sm" onClick={handleClose} />
              }
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {error && (
              <FormAlert
                message={
                  (error as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ?? "Failed to create auction."
                }
              />
            )}

            <FormInput
              id="title"
              label="Title"
              placeholder="Enter auction title"
              error={errors.title?.message}
              {...register("title")}
            />

            <div className="space-y-1">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-[#191919]"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="Describe the item being auctioned"
                className={`w-full px-3 py-2.5 border rounded-md text-sm text-[#191919] placeholder-[#999] outline-none transition-all resize-none focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] ${
                  errors.description
                    ? "border-[#b91c1c] focus:ring-[#b91c1c] focus:border-[#b91c1c]"
                    : "border-[#c2c2c2] hover:border-[#888]"
                }`}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-[#b91c1c] mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                id="startingPrice"
                label="Starting Price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                error={errors.startingPrice?.message}
                {...register("startingPrice")}
              />

              <FormInput
                id="buyoutPrice"
                label="Buyout Price (optional)"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                error={errors.buyoutPrice?.message}
                {...register("buyoutPrice")}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating…" : "Create Auction"}
              </Button>
            </div>
          </form>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
