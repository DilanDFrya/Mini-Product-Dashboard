import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function ProductsPageHeader() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Products List</h1>
      <Button asChild>
        <Link href="/products/add">
          <Plus className="mr-2 size-4" />
          Add Product
        </Link>
      </Button>
    </div>
  );
}

