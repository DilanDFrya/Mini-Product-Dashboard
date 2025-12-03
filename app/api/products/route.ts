/**
 * Fake Store API Base URL
 *
 * NOTE: This is a testing API. POST, PUT, and DELETE operations will return
 * success responses, but data changes are NOT persisted to the database.
 * This is expected behavior for a fake/testing API.
 */
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

/**
 * UpdateProductData type for partial product updates
 *
 * This type uses Partial<CreateProductData>, which makes all properties optional.
 * This allows updating only specific fields of a product without requiring all fields.
 *
 * Properties (all optional):
 * - title?: string
 * - price?: number
 * - description?: string
 * - category?: string
 * - image?: string
 *
 * This is used in the updateProduct() function to allow partial updates where only
 * the fields that need to be changed are provided, rather than requiring all fields.
 *
 * We use a type alias instead of an interface because we're not adding any new properties,
 * just making all properties from CreateProductData optional.
 */
export type UpdateProductData = Partial<CreateProductData>;

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
 * Note: Fake Store API doesn't persist data, so we generate a local ID
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
      const errorText = await response.text();
      console.error("Create product error response:", errorText);
      throw new Error(
        `Failed to create product: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    // Generate a unique ID for local storage (use timestamp + random)
    const localId = Date.now() + Math.floor(Math.random() * 1000);
    const product: Product = {
      ...result,
      id: localId,
      rating: result.rating || { rate: 0, count: 0 },
      // Ensure all required fields exist
      title: result.title || data.title,
      price: result.price || data.price,
      description: result.description || data.description,
      category: result.category || data.category,
      image: result.image || data.image,
    };

    console.log("Product created successfully:", product);
    return product;
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
      const errorText = await response.text();
      console.error("Update product error response:", errorText);
      if (response.status === 404) {
        throw new Error("Product not found");
      }
      throw new Error(
        `Failed to update product: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("Product updated successfully:", result);
    return result;
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
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Delete product error response:", errorText);
      if (response.status === 404) {
        throw new Error("Product not found");
      }
      throw new Error(
        `Failed to delete product: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("Product deleted successfully:", result);
    return result;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}
