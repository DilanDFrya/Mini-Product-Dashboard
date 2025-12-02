const API_BASE_URL = "https://fakestoreapi.com/products";

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CreateProductData {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

/**
 * Get all products
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

/**
 * Get a single product by ID
 */
export async function getProduct(id: number): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Product not found");
      }
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

/**
 * Create a new product
 */
export async function createProduct(data: CreateProductData): Promise<Product> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to create product: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(
  id: number,
  data: UpdateProductData
): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Product not found");
      }
      throw new Error(`Failed to update product: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(id: number): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Product not found");
      }
      throw new Error(`Failed to delete product: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}
