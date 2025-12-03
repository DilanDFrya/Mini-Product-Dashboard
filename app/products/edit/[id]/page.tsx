"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  getProduct,
  updateProduct,
  type Product,
} from "@/app/api/products/route";
import { saveUpdatedProduct, getUpdatedProducts } from "@/lib/storage/products";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(params.id as string);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(productId)) {
      router.push("/products");
      return;
    }

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if product was updated locally first
        const updatedProducts = getUpdatedProducts();
        let product: Product | null = updatedProducts[productId] || null;

        // If not in local updates, fetch from API
        if (!product) {
          product = await getProduct(productId);
        }

        setFormData({
          name: product.title,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          image: product.image,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
        console.error("Error fetching product:", err);
        // Redirect to products list if product not found
        if (err instanceof Error && err.message === "Product not found") {
          setTimeout(() => router.push("/products"), 2000);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Try to update via API (may fail for fake API, but that's ok)
      let updatedProduct: Product;
      try {
        updatedProduct = await updateProduct(productId, {
          title: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          image: formData.image || "https://via.placeholder.com/300",
        });
      } catch (apiError) {
        // If API update fails, create updated product from form data
        // First, try to get the original product to preserve rating
        let originalProduct: Product | null = null;
        try {
          originalProduct = await getProduct(productId);
        } catch {
          // If we can't get original, use default rating
        }

        updatedProduct = {
          id: productId,
          title: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          image: formData.image || "https://via.placeholder.com/300",
          rating: originalProduct?.rating || { rate: 0, count: 0 },
        };
      }

      // Save to local storage so it persists across page reloads
      saveUpdatedProduct(updatedProduct);

      // Reset submitting state before redirect
      setIsSubmitting(false);
      toast.success("Product updated successfully", {
        description: `${formData.name} has been updated.`,
      });
      // Redirect to products list on success
      router.push("/products");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update product";
      setError(errorMessage);
      toast.error("Failed to update product", {
        description: errorMessage,
      });
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/products">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Edit Product</h1>
        </div>
        <div className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && error === "Product not found") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/products">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Edit Product</h1>
        </div>
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 max-w-2xl">
          <p className="text-destructive font-medium">Product not found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Redirecting to products list...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/products">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Product</h1>
      </div>

      {error && error !== "Product not found" && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 max-w-2xl">
          <p className="text-destructive font-medium">Error</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-2xl rounded-lg border border-border bg-card p-6 shadow-sm"
      >
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Product Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">
              Price
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Input
              id="category"
              name="category"
              type="text"
              required
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., electronics, clothing"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="image" className="text-sm font-medium">
            Image URL
          </label>
          <Input
            id="image"
            name="image"
            type="url"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-xs text-muted-foreground">
            Leave empty to use a placeholder image
          </p>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/products">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
