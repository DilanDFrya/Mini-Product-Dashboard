"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface DeleteProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  productName?: string
  isDeleting?: boolean
}

export function DeleteProductModal({
  open,
  onOpenChange,
  onConfirm,
  productName,
  isDeleting = false,
}: DeleteProductModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl">
        <DialogHeader className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/10">
              <AlertTriangle className="size-5 text-destructive" />
            </div>
            <div className="space-y-1.5">
              <DialogTitle className="text-lg sm:text-xl">Delete Product</DialogTitle>
              <DialogDescription className="text-sm">
                Are you sure you want to delete this product? This action cannot
                be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        {productName && (
          <div className="rounded-xl bg-muted/50 p-3">
            <p className="text-sm font-medium line-clamp-2">{productName}</p>
          </div>
        )}
        <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="w-full sm:w-auto rounded-xl"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto rounded-xl"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

