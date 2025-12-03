import type { Product } from "@/app/api/products/route";

const STORAGE_KEYS = {
  CREATED_PRODUCTS: "products_created",
  UPDATED_PRODUCTS: "products_updated",
  DELETED_IDS: "products_deleted",
};

/**
 * Get all locally created products
 */
export function getCreatedProducts(): Product[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.CREATED_PRODUCTS);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Get all locally updated products
 */
export function getUpdatedProducts(): Record<number, Product> {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(STORAGE_KEYS.UPDATED_PRODUCTS);
  return stored ? JSON.parse(stored) : {};
}

/**
 * Get all deleted product IDs
 */
export function getDeletedIds(): number[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.DELETED_IDS);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Save a created product locally
 */
export function saveCreatedProduct(product: Product): void {
  if (typeof window === "undefined") return;
  const created = getCreatedProducts();
  created.push(product);
  localStorage.setItem(STORAGE_KEYS.CREATED_PRODUCTS, JSON.stringify(created));
}

/**
 * Save an updated product locally
 */
export function saveUpdatedProduct(product: Product): void {
  if (typeof window === "undefined") return;
  const updated = getUpdatedProducts();
  updated[product.id] = product;
  localStorage.setItem(STORAGE_KEYS.UPDATED_PRODUCTS, JSON.stringify(updated));
}

/**
 * Mark a product as deleted locally
 */
export function saveDeletedId(id: number): void {
  if (typeof window === "undefined") return;
  const deleted = getDeletedIds();
  if (!deleted.includes(id)) {
    deleted.push(id);
    localStorage.setItem(STORAGE_KEYS.DELETED_IDS, JSON.stringify(deleted));
  }
}

/**
 * Remove a created product (when it's deleted)
 */
export function removeCreatedProduct(id: number): void {
  if (typeof window === "undefined") return;
  const created = getCreatedProducts();
  const filtered = created.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.CREATED_PRODUCTS, JSON.stringify(filtered));
}

/**
 * Remove an updated product (when it's deleted)
 */
export function removeUpdatedProduct(id: number): void {
  if (typeof window === "undefined") return;
  const updated = getUpdatedProducts();
  delete updated[id];
  localStorage.setItem(STORAGE_KEYS.UPDATED_PRODUCTS, JSON.stringify(updated));
}

/**
 * Merge API products with local changes
 */
export function mergeProductsWithLocalChanges(
  apiProducts: Product[]
): Product[] {
  const created = getCreatedProducts();
  const updated = getUpdatedProducts();
  const deleted = getDeletedIds();

  // Start with API products
  let merged = [...apiProducts];

  // Remove deleted products
  merged = merged.filter((p) => !deleted.includes(p.id));

  // Apply updates
  merged = merged.map((p) => {
    const updatedProduct = updated[p.id];
    if (updatedProduct) {
      // Ensure rating exists
      return {
        ...updatedProduct,
        rating: updatedProduct.rating || p.rating || { rate: 0, count: 0 },
      };
    }
    // Ensure rating exists for API products too
    return {
      ...p,
      rating: p.rating || { rate: 0, count: 0 },
    };
  });

  // Add created products (ensure they have rating)
  const createdWithRating = created.map((p) => ({
    ...p,
    rating: p.rating || { rate: 0, count: 0 },
  }));

  merged = [...merged, ...createdWithRating];

  return merged;
}

/**
 * Clear all local changes (for testing/reset)
 */
export function clearLocalChanges(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.CREATED_PRODUCTS);
  localStorage.removeItem(STORAGE_KEYS.UPDATED_PRODUCTS);
  localStorage.removeItem(STORAGE_KEYS.DELETED_IDS);
}
