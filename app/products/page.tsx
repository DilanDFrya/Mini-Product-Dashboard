"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getProducts,
  deleteProduct,
  type Product,
} from "@/app/api/products/route";
import {
  mergeProductsWithLocalChanges,
  saveDeletedId,
  removeCreatedProduct,
  removeUpdatedProduct,
} from "@/lib/storage/products";
import { DeleteProductModal } from "@/components/delete-product-modal";
import { ProductsPageHeader } from "@/components/product/products-page-header";
import { ProductSearchBar } from "@/components/product/product-search-bar";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductsTable } from "@/components/product/products-table";
import { ProductsEmptyState } from "@/components/product/products-empty-state";
import { ProductsPagination } from "@/components/product/products-pagination";
import { ProductsLoadingSkeleton } from "@/components/product/products-loading-skeleton";
import { ProductsErrorState } from "@/components/product/products-error-state";

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const apiData = await getProducts();
      // Merge with local changes (created/updated/deleted)
      const mergedData = mergeProductsWithLocalChanges(apiData);
      setAllProducts(mergedData);
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

    // Search filter - search by product name (title) only
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      const queryWords = query.split(/\s+/).filter(Boolean);

      filtered = filtered.filter((product) => {
        const title = product.title.toLowerCase();

        // Check if all query words appear in the product title
        return queryWords.every((word) => {
          // Simple substring match - fast and reliable
          return title.includes(word);
        });
      });
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

  const handleDeleteClick = (id: number, name: string) => {
    setProductToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);

      // Try to delete from API (may fail for fake API, but that's ok)
      try {
        await deleteProduct(productToDelete.id);
      } catch (apiError) {
        // API delete may fail, but we'll still save locally
        console.warn("API delete failed, saving locally:", apiError);
      }

      // Save deletion locally
      saveDeletedId(productToDelete.id);
      removeCreatedProduct(productToDelete.id);
      removeUpdatedProduct(productToDelete.id);

      // Refresh the product list after deletion
      await fetchProducts();
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      toast.success("Product deleted successfully", {
        description: `${productToDelete.name} has been removed.`,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete product";
      toast.error("Failed to delete product", {
        description: errorMessage,
      });
      console.error("Error deleting product:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/products/edit/${id}`);
  };

  if (isLoading) {
    return <ProductsLoadingSkeleton />;
  }

  if (error) {
    return <ProductsErrorState error={error} onRetry={fetchProducts} />;
  }

  return (
    <div className="space-y-4">
      <ProductsPageHeader />

      {/* Search and Filters */}
      <div className="space-y-4">
        <ProductSearchBar value={searchQuery} onChange={setSearchQuery} />

        <ProductFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          filteredCount={filteredProducts.length}
          totalCount={allProducts.length}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <ProductsEmptyState
          hasProducts={allProducts.length > 0}
          onClearFilters={clearFilters}
        />
      ) : (
        <div className="space-y-4">
          <ProductsTable
            products={paginatedProducts}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            searchQuery={searchQuery}
          />

          <ProductsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      )}

      <DeleteProductModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        productName={productToDelete?.name}
        isDeleting={isDeleting}
      />
    </div>
  );
}
