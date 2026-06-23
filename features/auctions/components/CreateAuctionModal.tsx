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
  images: z
    .custom<FileList>()
    .optional()
    .refine(
      (files) => !files || files.length <= 5,
      "You can upload a maximum of 5 images",
    )
    .refine(
      (files) =>
        !files ||
        Array.from(files).every((f) =>
          ["image/jpeg", "image/png", "image/webp"].includes(f.type),
        ),
      "Only JPEG, PNG and WEBP images are allowed",
    ),
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
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("startingPrice", values.startingPrice);
    if (values.buyoutPrice) {
      formData.append("buyoutPrice", values.buyoutPrice);
    }

    if (values.images && values.images.length > 0) {
      Array.from(values.images).forEach((file) => {
        formData.append("images", file);
      });
    }

    createAuction(formData, {
      onSuccess: () => handleClose(),
    });
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
              Napravi aukciju
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
                    ?.response?.data?.message ?? "Neuspelo kreiranje aukcije."
                }
              />
            )}

            <FormInput
              id="title"
              label="Ime"
              placeholder="Unesite ime aukcije"
              error={errors.title?.message}
              {...register("title")}
            />

            <div className="space-y-1">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-[#191919]"
              >
                Opis
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="Unesite opis aukcije"
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
                label="Početna cena"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                error={errors.startingPrice?.message}
                {...register("startingPrice")}
              />

              <FormInput
                id="buyoutPrice"
                label="Cena otkupa (opciono)"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                error={errors.buyoutPrice?.message}
                {...register("buyoutPrice")}
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="images"
                className="block text-sm font-medium text-[#191919]"
              >
                Slike (max 5)
              </label>
              <input
                id="images"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="w-full text-sm text-[#999] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#0a66c2] file:text-white hover:file:bg-[#0a66c2]/90 cursor-pointer"
                {...register("images")}
              />
              {errors.images && (
                <p className="text-xs text-[#b91c1c] mt-1">
                  {errors.images.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Otkaži
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Kreiranje…" : "Napravi aukciju"}
              </Button>
            </div>
          </form>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
