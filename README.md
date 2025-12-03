# Product Dashboard

A modern, full-featured product management dashboard built with Next.js, React, and TypeScript. This application allows you to manage products with full CRUD (Create, Read, Update, Delete) operations, search, filtering, and pagination capabilities.

## 🚀 Features

### Core Functionality

- **Products List** - View all products in a beautiful, sortable table
- **Add Product** - Create new products with a comprehensive form
- **Edit Product** - Update existing product information
- **Delete Product** - Remove products with confirmation modal

### Advanced Features

- **Search** - Search products by name or description
- **Category Filter** - Filter products by category
- **Price Range Filter** - Filter products by minimum and maximum price
- **Pagination** - Navigate through products with customizable rows per page (5, 10, 20, 50, 100)
- **Product Images** - Display product images using Next.js Image optimization
- **Product Ratings** - View product ratings in hover cards with full descriptions
- **Toast Notifications** - Get instant feedback for all CRUD operations
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Collapsible Sidebar** - Icon-only mode for a cleaner interface

## 📋 How the App Works

### Application Flow

1. **Initial Load**: When you open the app, it redirects to `/products` page
2. **Data Fetching**: The app fetches products from the Fake Store API
3. **Data Merging**: API data is merged with locally stored changes (created/updated/deleted products)
4. **Display**: Products are displayed in a table with search, filters, and pagination
5. **User Actions**: Users can search, filter, add, edit, or delete products
6. **Persistence**: All changes are saved to localStorage to persist across page reloads

### Page Structure

- **`/products`** - Main products list page with table, search, filters, and pagination
- **`/products/add`** - Form to create new products
- **`/products/edit/[id]`** - Form to edit existing products by ID

## 🔌 API Integration (`app/api/products/route.ts`)

The app integrates with the **Fake Store API** (`https://fakestoreapi.com/products`) to fetch product data.

### What the API Does

The API module (`app/api/products/route.ts`) provides functions to interact with the Fake Store API:

#### 1. **`getProducts()`** - Fetch All Products

- **Purpose**: Retrieves all products from the Fake Store API
- **Returns**: Array of `Product` objects
- **Usage**: Called on page load to display all products

#### 2. **`getProduct(id)`** - Fetch Single Product

- **Purpose**: Retrieves a specific product by its ID
- **Parameters**: `id: number` - The product ID
- **Returns**: Single `Product` object
- **Usage**: Called when editing a product to load its current data

#### 3. **`createProduct(data)`** - Create New Product

- **Purpose**: Creates a new product via API POST request
- **Parameters**: `data: CreateProductData` - Product information (title, price, description, category, image)
- **Returns**: `Product` object with generated ID
- **Note**: Since Fake Store API doesn't persist data, a local ID is generated using timestamp + random number
- **Usage**: Called when submitting the "Add Product" form

#### 4. **`updateProduct(id, data)`** - Update Existing Product

- **Purpose**: Updates an existing product via API PUT request
- **Parameters**:
  - `id: number` - The product ID to update
  - `data: UpdateProductData` - Partial product data (all fields optional)
- **Returns**: Updated `Product` object
- **Usage**: Called when submitting the "Edit Product" form

#### 5. **`deleteProduct(id)`** - Delete Product

- **Purpose**: Deletes a product via API DELETE request
- **Parameters**: `id: number` - The product ID to delete
- **Returns**: Deleted `Product` object
- **Usage**: Called when confirming product deletion

### Important Note About Fake Store API

⚠️ **The Fake Store API is a testing API**. While POST, PUT, and DELETE operations return success responses, **data changes are NOT persisted** to the database. This is expected behavior for a fake/testing API.

**Solution**: The app uses **localStorage** to persist all changes locally, so your created, updated, and deleted products remain visible even after page reloads.

## 💾 Storage System (`lib/storage/products.ts`)

Since the Fake Store API doesn't persist changes, the app uses **localStorage** to save all user modifications locally in the browser.

### What Storage Does

The storage module (`lib/storage/products.ts`) manages three types of local changes:

#### 1. **Created Products** (`products_created`)

- **Purpose**: Stores products that you've created
- **Storage Key**: `"products_created"`
- **Format**: Array of `Product` objects
- **Functions**:
  - `getCreatedProducts()` - Retrieve all locally created products
  - `saveCreatedProduct(product)` - Save a newly created product
  - `removeCreatedProduct(id)` - Remove a created product when it's deleted

#### 2. **Updated Products** (`products_updated`)

- **Purpose**: Stores products that you've modified
- **Storage Key**: `"products_updated"`
- **Format**: Object with product IDs as keys and `Product` objects as values
- **Functions**:
  - `getUpdatedProducts()` - Retrieve all locally updated products
  - `saveUpdatedProduct(product)` - Save an updated product
  - `removeUpdatedProduct(id)` - Remove an updated product when it's deleted

#### 3. **Deleted Product IDs** (`products_deleted`)

- **Purpose**: Tracks which products have been deleted
- **Storage Key**: `"products_deleted"`
- **Format**: Array of product IDs (numbers)
- **Functions**:
  - `getDeletedIds()` - Retrieve all deleted product IDs
  - `saveDeletedId(id)` - Mark a product as deleted

### How Storage Works with API

The magic happens in the **`mergeProductsWithLocalChanges()`** function:

1. **Fetch from API**: Get all products from Fake Store API
2. **Remove Deleted**: Filter out products that are in the deleted IDs list
3. **Apply Updates**: Replace API products with locally updated versions
4. **Add Created**: Append all locally created products to the list
5. **Return Merged**: Return the final merged list

This ensures that:

- ✅ Your created products appear in the list
- ✅ Your updated products show the latest changes
- ✅ Deleted products are hidden from the list
- ✅ All changes persist across page reloads

### Storage Flow Example

**Scenario**: You create a new product, update an existing one, and delete another.

1. **Create Product**:

   - API call: `createProduct()` → Returns product with ID
   - Storage: `saveCreatedProduct()` → Saves to `products_created` array

2. **Update Product**:

   - API call: `updateProduct()` → Returns updated product
   - Storage: `saveUpdatedProduct()` → Saves to `products_updated` object

3. **Delete Product**:

   - API call: `deleteProduct()` → Returns deleted product
   - Storage: `saveDeletedId()` → Adds ID to `products_deleted` array
   - Storage: `removeCreatedProduct()` and `removeUpdatedProduct()` → Cleans up if product was created/updated locally

4. **Page Reload**:
   - API: Fetches fresh data from Fake Store API
   - Storage: `mergeProductsWithLocalChanges()` → Combines API data with all local changes
   - Result: You see all your changes preserved!

## 🏗️ Project Structure

```
mini-product-dashboard/
├── app/
│   ├── api/
│   │   └── products/
│   │       └── route.ts          # API functions (getProducts, createProduct, etc.)
│   ├── products/
│   │   ├── page.tsx              # Products list page
│   │   ├── add/
│   │   │   └── page.tsx          # Add product page
│   │   └── edit/
│   │       └── [id]/
│   │           └── page.tsx      # Edit product page
│   ├── layout.tsx                # Root layout with sidebar
│   ├── page.tsx                  # Home page (redirects to /products)
│   └── globals.css               # Global styles and theme
├── components/
│   ├── product/                  # Product-related components
│   │   ├── products-page-header.tsx
│   │   ├── product-search-bar.tsx
│   │   ├── product-filters.tsx
│   │   ├── products-table.tsx
│   │   ├── products-empty-state.tsx
│   │   ├── products-pagination.tsx
│   │   ├── products-loading-skeleton.tsx
│   │   └── products-error-state.tsx
│   ├── ui/                       # Reusable UI components
│   │   ├── sidebar.tsx
│   │   ├── table.tsx
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── hover-card.tsx
│   │   ├── dialog.tsx
│   │   └── sonner.tsx
│   ├── sidebar-nav.tsx           # Sidebar navigation
│   └── delete-product-modal.tsx   # Delete confirmation modal
├── lib/
│   └── storage/
│       └── products.ts           # localStorage functions
└── README.md
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd mini-product-dashboard
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

The app will automatically redirect to the products page.

## 📖 How to Use

### Viewing Products

1. Navigate to the **Products List** page (default)
2. Use the **search bar** to search by product name or description
3. Use **category filter** to filter by product category
4. Use **price range filters** to filter by minimum and maximum price
5. Use **pagination controls** to navigate through pages
6. Adjust **rows per page** to show 5, 10, 20, 50, or 100 products
7. **Hover over a product row** to see detailed rating information in a hover card

### Adding a Product

1. Click **"Add Product"** button in the header or sidebar
2. Fill in the form:
   - **Name**: Product title
   - **Description**: Product description
   - **Price**: Product price (number)
   - **Category**: Product category
   - **Image URL**: Product image URL (optional, defaults to placeholder)
3. Click **"Create Product"**
4. You'll see a success toast notification
5. You'll be redirected to the products list with your new product visible

### Editing a Product

1. Click the **Edit button** (pencil icon) on any product row
2. The form will be pre-filled with current product data
3. Modify the fields you want to change
4. Click **"Update Product"**
5. You'll see a success toast notification
6. You'll be redirected to the products list with your changes visible

### Deleting a Product

1. Click the **Delete button** (trash icon) on any product row
2. A confirmation modal will appear
3. Review the product name and confirm deletion
4. Click **"Delete"** in the modal
5. You'll see a success toast notification
6. The product will be removed from the list

## 🎨 Theme & Styling

The app uses a **Purple/Violet** color theme with:

- Custom CSS variables for theming
- Tailwind CSS for styling
- Responsive design with mobile support
- Smooth animations and transitions
- Themed sidebar with icon-only collapse mode

## 🔧 Technical Details

### Technologies Used

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Sonner** - Toast notifications
- **Lucide React** - Icon library
- **next-themes** - Theme management

### Key Concepts

- **Server Components**: Layout and static pages
- **Client Components**: Interactive pages and components (marked with `"use client"`)
- **API Routes**: Functions to interact with external API
- **localStorage**: Browser storage for data persistence
- **Optimistic Updates**: Immediate UI updates before API confirmation
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Skeleton loaders and loading indicators

## 📝 Notes

- All changes are stored in **localStorage** and persist across page reloads
- The Fake Store API doesn't persist changes, so localStorage is essential
- Product images are optimized using Next.js Image component
- The app is fully responsive and works on all device sizes

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📚 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
