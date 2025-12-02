"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getProducts, deleteProduct, type Product } from "@/lib/api/products";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({
    min: "",
    max: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProducts();
      setAllProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(allProducts.map((p) => p.category))
    ).sort();
    return uniqueCategories;
  }, [allProducts]);

  // Filter products based on search, category, and price
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Price range filter
    if (priceRange.min) {
      const min = parseFloat(priceRange.min);
      if (!isNaN(min)) {
        filtered = filtered.filter((product) => product.price >= min);
      }
    }
    if (priceRange.max) {
      const max = parseFloat(priceRange.max);
      if (!isNaN(max)) {
        filtered = filtered.filter((product) => product.price <= max);
      }
    }

    return filtered;
  }, [allProducts, searchQuery, selectedCategory, priceRange]);

  // Paginate filtered products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, priceRange]);

  // Reset to page 1 when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange({ min: "", max: "" });
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "all" ||
    priceRange.min !== "" ||
    priceRange.max !== "";

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteProduct(id);
      // Refresh the product list after deletion
      await fetchProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete product");
      console.error("Error deleting product:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products List</h1>
          <Button asChild>
            <Link href="/products/add">
              <Plus className="mr-2 size-4" />
              Add Product
            </Link>
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-16 w-16 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products List</h1>
          <Button asChild>
            <Link href="/products/add">
              <Plus className="mr-2 size-4" />
              Add Product
            </Link>
          </Button>
        </div>
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-destructive font-medium">Error loading products</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button onClick={fetchProducts} className="mt-4" variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products List</h1>
        <Button asChild>
          <Link href="/products/add">
            <Plus className="mr-2 size-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar - Prominent */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 pl-10 text-base"
          />
        </div>

        {/* Filters Section */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Filters</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                size="sm"
                className="h-7 text-xs"
              >
                <X className="mr-1.5 size-3.5" />
                Clear all
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Price Range
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min $"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value })
                  }
                  className="h-9"
                  step="0.01"
                  min="0"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max $"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
                  className="h-9"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {filteredProducts.length}
                </span>{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
                {allProducts.length !== filteredProducts.length && (
                  <span className="ml-1">of {allProducts.length} total</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">
            {allProducts.length === 0
              ? "No products found."
              : "No products match your filters."}
          </p>
          {allProducts.length === 0 ? (
            <Button asChild>
              <Link href="/products/add">
                <Plus className="mr-2 size-4" />
                Add Your First Product
              </Link>
            </Button>
          ) : (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Products Table */}
          <div className="rounded-md border">
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
                {paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-16 w-16 rounded object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://via.placeholder.com/64?text=No+Image";
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.title}
                    </TableCell>
                    <TableCell className="max-w-md truncate">
                      {product.description}
                    </TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell className="capitalize">
                      {product.category}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-start gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            router.push(`/products/edit/${product.id}`)
                          }
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination - Separate from table */}
          <div className="flex flex-col gap-4 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Rows per page:
                </span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => setItemsPerPage(parseInt(value))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {totalPages > 1 && (
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
              )}
            </div>
            {totalPages > 1 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="mr-1 size-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first page, last page, current page, and pages around current
                      if (page === 1 || page === totalPages) return true;
                      if (Math.abs(page - currentPage) <= 1) return true;
                      return false;
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there's a gap
                      const showEllipsisBefore =
                        index > 0 && array[index - 1] !== page - 1;
                      return (
                        <div key={page} className="flex items-center gap-1">
                          {showEllipsisBefore && (
                            <span className="px-2 text-muted-foreground">
                              ...
                            </span>
                          )}
                          <Button
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="min-w-10"
                          >
                            {page}
                          </Button>
                        </div>
                      );
                    })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="ml-1 size-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
