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

interface ProductsTableProps {
  products: Product[];
  onEdit: (id: number) => void;
  onDelete: (id: number, name: string) => void;
}

export function ProductsTable({
  products,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-left">Actions</TableHead>
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
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {product.description}
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell className="capitalize">
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
  );
}
