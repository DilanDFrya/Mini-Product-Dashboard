import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductsEmptyStateProps {
  hasProducts: boolean;
  onClearFilters: () => void;
}

export function ProductsEmptyState({
  hasProducts,
  onClearFilters,
}: ProductsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-muted-foreground mb-4">
        {hasProducts
          ? "No products match your filters."
          : "No products found."}
      </p>
      {hasProducts ? (
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      ) : (
        <Button asChild>
          <Link href="/products/add">
            <Plus className="mr-2 size-4" />
            Add Your First Product
          </Link>
        </Button>
      )}
    </div>
  );
}

