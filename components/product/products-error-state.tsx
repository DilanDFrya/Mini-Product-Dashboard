import { Button } from "@/components/ui/button";
import { ProductsPageHeader } from "./products-page-header";

interface ProductsErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ProductsErrorState({
  error,
  onRetry,
}: ProductsErrorStateProps) {
  return (
    <div className="space-y-4">
      <ProductsPageHeader />
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-destructive font-medium">Error loading products</p>
        <p className="text-sm text-muted-foreground mt-1">{error}</p>
        <Button onClick={onRetry} className="mt-4" variant="outline">
          Try Again
        </Button>
      </div>
    </div>
  );
}

