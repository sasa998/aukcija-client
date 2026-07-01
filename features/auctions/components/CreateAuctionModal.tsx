"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/FormInput";
import { FormAlert } from "@/components/ui/FormAlert";
import { useCreateAuction } from "@/features/auctions/hooks/useAuctions";
import { CATEGORIES } from "@/lib/categories";
import Image from "next/image";

const imagesArraySchema = z
  .array(z.instanceof(File))
  .max(5, "Možete otpremiti maksimalno 5 slika")
  .refine(
    (files) =>
      files.every((f) =>
        ["image/jpeg", "image/png", "image/webp"].includes(f.type),
      ),
    "Dozvoljene su samo JPEG, PNG i WEBP slike",
  )
  .optional();

const createAuctionSchema = z.object({
  title: z.string().min(3, "Ime mora imati najmanje 3 karaktera"),
  description: z.string().min(10, "Opis mora imati najmanje 10 karaktera"),
  categoryId: z.string().min(1, "Kategorija je obavezna"),
  startingPrice: z
    .string()
    .min(1, "Početna cena je obavezna")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
      message: "Početna cena mora biti pozitivan broj",
    }),
  buyoutPrice: z
    .string()
    .optional()
    .refine((v) => !v || (!isNaN(Number(v)) && Number(v) > 0), {
      message: "Cena otkupa mora biti pozitivan broj",
    }),
  images: imagesArraySchema,
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

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateAuctionFormValues>({
    resolver: zodResolver(createAuctionSchema),
    defaultValues: {
      categoryId: "",
    },
  });

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    const newFiles = Array.from(selected);
    const updatedFiles = [...imageFiles, ...newFiles].slice(0, 5);
    const newUrls = newFiles.map((f) => URL.createObjectURL(f));
    const updatedUrls = [...previewUrls, ...newUrls].slice(0, 5);

    setImageFiles(updatedFiles);
    setPreviewUrls(updatedUrls);
    setValue("images", updatedFiles, { shouldValidate: true });

    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);

    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    const updatedUrls = previewUrls.filter((_, i) => i !== index);

    setImageFiles(updatedFiles);
    setPreviewUrls(updatedUrls);
    setValue("images", updatedFiles.length > 0 ? updatedFiles : undefined, {
      shouldValidate: true,
    });
  };

  const handleClose = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setImageFiles([]);
    reset();
    onOpenChange(false);
  };

  const onSubmit = (values: CreateAuctionFormValues) => {
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("category", values.categoryId);
    formData.append("startingPrice", values.startingPrice);
    if (values.buyoutPrice) {
      formData.append("buyoutPrice", values.buyoutPrice);
    }

    if (values.images && values.images.length > 0) {
      values.images.forEach((file) => formData.append("images", file));
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

            <div className="space-y-1">
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium text-[#191919]"
              >
                Kategorija
              </label>
              <div className="relative">
                <select
                  id="categoryId"
                  className={`w-full appearance-none px-3 py-2.5 pr-9 border rounded-md text-sm text-[#191919] outline-none transition-all bg-white focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] ${
                    errors.categoryId
                      ? "border-[#b91c1c] focus:ring-[#b91c1c] focus:border-[#b91c1c]"
                      : "border-[#c2c2c2] hover:border-[#888]"
                  }`}
                  {...register("categoryId")}
                >
                  <option value="" disabled>
                    Izaberite kategoriju
                  </option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#888]">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
              {errors.categoryId && (
                <p className="text-xs text-[#b91c1c] mt-1">
                  {errors.categoryId.message}
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
                className="text-sm text-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#0a66c2] file:text-white hover:file:bg-[#0a66c2]/90 cursor-pointer file:cursor-pointer"
                ref={fileInputRef}
                onChange={handleImagesChange}
              />
              {errors.images && (
                <p className="text-xs text-[#b91c1c] mt-1">
                  {errors.images.message}
                </p>
              )}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-2">
                  {previewUrls.map((url, index) => (
                    <div key={url} className="relative group aspect-square">
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-md border border-[#c2c2c2]"
                        width={100}
                        height={100}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-1.5 -right-1.5 bg-[#b91c1c] text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
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
