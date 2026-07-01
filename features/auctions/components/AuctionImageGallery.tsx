"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ImageIcon,
  XIcon,
} from "lucide-react";

import { AuctionStatus } from "@/features/auctions/types";

const statusStyles: Record<AuctionStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700 border border-green-200",
  ENDED: "bg-gray-100 text-gray-600 border border-gray-200",
  CANCELLED: "bg-red-100 text-red-700 border border-red-200",
  PENDING: "bg-yellow-100 text-yellow-700 border border-yellow-200",
};

const statusLabels: Record<AuctionStatus, string> = {
  ACTIVE: "Aktivna",
  ENDED: "Završena",
  CANCELLED: "Otkazana",
  PENDING: "Na čekanju",
};

interface AuctionImageGalleryProps {
  images: string[];
  title: string;
  status: AuctionStatus;
}

export function AuctionImageGallery({
  images,
  title,
  status,
}: AuctionImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const selectedImage = images[selectedIndex];

  function prevImage() {
    setSelectedIndex((i) => (i - 1 + images.length) % images.length);
  }

  function nextImage() {
    setSelectedIndex((i) => (i + 1) % images.length);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isLightboxOpen) return;
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "Escape") setIsLightboxOpen(false);
  }

  return (
    <>
      <div className="space-y-3">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#e0e0e0] bg-[#f3f2ef] group">
          {selectedImage ? (
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute inset-0 w-full h-full cursor-zoom-in"
            >
              <Image
                src={selectedImage}
                alt={title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </button>
          ) : (
            <div className="flex h-full items-center justify-center text-[#c2c2c2]">
              <ImageIcon className="size-16" />
            </div>
          )}

          <span
            className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[status]}`}
          >
            {statusLabels[status]}
          </span>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeftIcon className="size-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRightIcon className="size-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedIndex(idx)}
                    className={`size-1.5 rounded-full transition-all ${
                      idx === selectedIndex
                        ? "bg-white scale-125"
                        : "bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, idx) => (
              <button
                key={img}
                onClick={() => setSelectedIndex(idx)}
                className={`relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  idx === selectedIndex
                    ? "border-[#0a66c2]"
                    : "border-[#e0e0e0] hover:border-[#0a66c2]/50"
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {isLightboxOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 size-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          >
            <XIcon className="size-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
              >
                <ChevronLeftIcon className="size-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
              >
                <ChevronRightIcon className="size-6" />
              </button>
            </>
          )}

          <div
            className="relative w-full max-w-4xl max-h-[85vh] mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt={title}
              width={1200}
              height={900}
              className="object-contain w-full h-full max-h-[85vh] rounded-lg"
            />
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
