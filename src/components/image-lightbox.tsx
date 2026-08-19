"use client";

import React from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  altText: string;
}

export function ImageLightbox({ isOpen, onClose, imageSrc, altText }: ImageLightboxProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 overflow-hidden border-none bg-transparent shadow-none flex items-center justify-center">
        <VisuallyHidden>
            <DialogTitle>{altText}</DialogTitle>
        </VisuallyHidden>
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={imageSrc}
            alt={altText}
            fill
            className="object-contain"
            priority
            unoptimized={imageSrc.startsWith('http')}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
