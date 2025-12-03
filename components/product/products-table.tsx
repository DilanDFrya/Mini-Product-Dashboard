import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Edit, Trash2, Star } from "lucide-react";
import type { Product } from "@/app/api/products/route";
import { HighlightText } from "./highlight-text";

interface ProductsTableProps {
  products: Product[];
  onEdit: (id: number) => void;
  onDelete: (id: number, name: string) => void;
  searchQuery?: string;
}

export function ProductsTable({
  products,
  onEdit,
  onDelete,
  searchQuery = "",
}: ProductsTableProps) {
  return (
    <>
      {/* Mobile Card Layout */}
      <div className="block md:hidden space-y-3">
        {products.map((product) => (
          <HoverCard key={product.id}>
            <HoverCardTrigger asChild>
              <div className="rounded-lg border border-border bg-card p-4 shadow-sm cursor-pointer">
                <div className="flex gap-3">
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded object-cover shrink-0"
                    unoptimized
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1 line-clamp-2 wrap-break-word">
                      <HighlightText
                        text={product.title}
                        searchQuery={searchQuery}
                      />
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(product.id);
                          }}
                        >
                          <Edit className="size-3.5" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(product.id, product.title);
                          }}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground capitalize">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80" align="start" side="bottom">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold mb-1">
                    {product.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {product.description}
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-2 border-t">
                  <div className="flex items-center gap-1.5">
                    <Star className="size-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">
                      {product.rating?.rate ?? 0}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({product.rating?.count ?? 0} reviews)
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block rounded-lg border border-border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead className="min-w-[200px]">Name</TableHead>
              <TableHead className="hidden lg:table-cell">
                Description
              </TableHead>
              <TableHead className="w-24">Price</TableHead>
              <TableHead className="hidden md:table-cell w-32">
                Category
              </TableHead>
              <TableHead className="text-left w-28">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <HoverCard key={product.id}>
                <HoverCardTrigger asChild>
                  <TableRow className="cursor-pointer">
                    <TableCell>
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded object-cover"
                        unoptimized
                      />
                    </TableCell>
                    <TableCell className="font-medium min-w-[200px] max-w-[300px]">
                      <div className="wrap-break-word">
                        <HighlightText
                          text={product.title}
                          searchQuery={searchQuery}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md truncate hidden lg:table-cell">
                      {product.description}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      ${product.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="capitalize hidden md:table-cell">
                      {product.category}
                    </TableCell>
                    <TableCell className="text-left">
                      <div className="flex justify-start gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(product.id);
                          }}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(product.id, product.title);
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </HoverCardTrigger>
                <HoverCardContent className="w-80" align="start" side="bottom">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">
                        {product.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {product.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 pt-2 border-t">
                      <div className="flex items-center gap-1.5">
                        <Star className="size-4 fill-primary text-primary" />
                        <span className="text-sm font-medium">
                          {product.rating?.rate ?? 0}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({product.rating?.count ?? 0} reviews)
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
