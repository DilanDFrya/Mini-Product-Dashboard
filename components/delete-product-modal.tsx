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
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="size-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription className="mt-1">
                Are you sure you want to delete this product? This action cannot
                be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        {productName && (
          <div className="rounded-md bg-muted/50 p-3">
            <p className="text-sm font-medium">{productName}</p>
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

