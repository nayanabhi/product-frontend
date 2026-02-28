# Product Catalog Frontend

A responsive React application for browsing, searching, and filtering products. Built with Vite, React 19, and a modular component architecture.

---

## Table of Contents

- [Requirements & Supporting Evidence](#requirements--supporting-evidence)
- [Additional Functionality](#additional-functionality)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)

---

## Requirements & Supporting Evidence

### 1. Fetch and Display Products in a Grid (Image, Title, Price)

| Evidence | Location | Description |
|----------|----------|-------------|
| **Product fetching** | `src/services/api.js` | `fetchProducts()` calls `GET /api/products` with `search`, `category`, `page`, and `limit` params |
| **Grid layout** | `src/components/ProductGrid.jsx` | Renders products in a grid via `grid` CSS class; maps each product to `ProductCard` |
| **Product display** | `src/components/ProductCard.jsx` | Renders `product.image`, `product.title`, and `product.price` (₹) per card |
| **Responsive grid** | `src/styles/product.css` | `.grid` uses CSS Grid: 2 columns (mobile), `auto-fill minmax(220px, 1fr)` (desktop) |

---

### 2. Implement Search and Category Filter

| Evidence | Location | Description |
|----------|----------|-------------|
| **Search component** | `src/components/SearchBar.jsx` | Controlled input bound to context `search`/`setSearch`; clear button when text exists |
| **Category filter** | `src/components/CategoryFilter.jsx` | Select dropdown for All, Electronics, Fashion, Books, Home, Sports |
| **Debounced search** | `src/hooks/useDebounce.js` | 400ms debounce to reduce API calls while typing |
| **State integration** | `src/context/ProductContext.jsx` | `debouncedSearch` and `category` trigger `fetchProducts()` via `useEffect` |
| **API params** | `src/services/api.js` | Passes `search` and `category` to backend |

---

### 3. Show Skeleton Loader While Fetching

| Evidence | Location | Description |
|----------|----------|-------------|
| **Skeleton component** | `src/components/SkeletonCard.jsx` | Placeholder card with image and text line blocks |
| **Loading state** | `src/components/ProductGrid.jsx` | When `loading` is true, renders `limit` × `SkeletonCard` instead of products |
| **Shimmer animation** | `src/styles/product.css` | `.skeleton-image` and `.skeleton-line` use `shimmer` keyframe animation |
| **Count matches limit** | `src/components/ProductGrid.jsx` | Skeleton count uses `limit` from context (5, 10, 15, 20) |

---

### 4. Responsive Layout (Flex/Grid) for Mobile and Desktop

| Evidence | Location | Description |
|----------|----------|-------------|
| **Main layout** | `src/styles/product.css` | `.container` uses Flexbox; `.grid` uses CSS Grid |
| **Product grid** | `src/styles/product.css` | Mobile: 2 columns; ≥640px: `repeat(auto-fill, minmax(220px, 1fr))` |
| **Toolbar** | `src/styles/product.css` | Mobile: stacked (column); ≥640px: row layout for search + filter |
| **Pagination info** | `src/styles/product.css` | Mobile: stacked; ≥640px: row with space-between |
| **Viewport** | `index.html` | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` |

---

### 5. State Management (React Context)

| Evidence | Location | Description |
|----------|----------|-------------|
| **Product context** | `src/context/ProductContext.jsx` | Central state: `products`, `loading`, `error`, `search`, `category`, `page`, `limit`, `totalPages`, `totalCount` |
| **Provider setup** | `src/main.jsx` | App wrapped with `<ProductProvider>` |
| **Custom hook** | `src/context/ProductContext.jsx` | `useProducts()` exposes context to components |
| **Consumer usage** | `SearchBar`, `CategoryFilter`, `ProductGrid`, `Pagination` | All use `useProducts()` for state and actions |

---

### 6. Pagination or Infinite Scroll

| Evidence | Location | Description |
|----------|----------|-------------|
| **Pagination component** | `src/components/Pagination.jsx` | Previous/Next, "Page X of Y", visible when products exist |
| **Items per page** | `src/components/Pagination.jsx` | Dropdown: 5, 10, 15, 20 items per page |
| **Page state** | `src/context/ProductContext.jsx` | `page`, `setPage`, `limit`, `setLimit`; page resets on search/category/limit change |
| **API integration** | `src/services/api.js` | `fetchProducts()` sends `page` and `limit` to backend |
| **Display info** | `src/components/Pagination.jsx` | "Showing X of Y products" |

---

### 7. Unit Test for One Component

| Evidence | Location | Description |
|----------|----------|-------------|
| **Test file** | `src/components/ProductCard.test.jsx` | Vitest + React Testing Library |
| **Test 1** | Renders image, title, price | Asserts img src, heading text, price label |
| **Test 2** | Lazy loading | Asserts `loading="lazy"` on img |
| **Run command** | `package.json` | `npm run test` or `npm run test:watch` |

---

## Additional Functionality

| Feature | Location | Description |
|---------|----------|-------------|
| **Error handling** | `ProductGrid.jsx`, `ProductContext.jsx` | Error state UI; `error` from failed fetch |
| **Empty state** | `ProductGrid.jsx` | Message when no products match search/filter |
| **Image fallback** | `ProductCard.jsx` | Placeholder (first letter) when image missing or fails to load |
| **Accessibility** | Multiple components | `aria-label`, `aria-live`, semantic HTML (`article`, `button`) |
| **Light/Dark mode** | `src/index.css` | `prefers-color-scheme` for CSS variables |
| **Debounced search** | `useDebounce.js`, `ProductContext.jsx` | 400ms delay before API call |

---

## Project Structure

```
src/
├── components/
│   ├── ProductCard.jsx      # Product display (image, title, price)
│   ├── ProductCard.test.jsx # Unit tests
│   ├── ProductGrid.jsx      # Grid layout, loading/empty/error states
│   ├── SearchBar.jsx        # Search input + clear button
│   ├── CategoryFilter.jsx   # Category dropdown
│   ├── Pagination.jsx       # Page controls, items-per-page
│   └── SkeletonCard.jsx     # Loading placeholder
├── context/
│   └── ProductContext.jsx   # Global product state
├── hooks/
│   └── useDebounce.js       # Debounce hook
├── services/
│   └── api.js               # Product API client
├── styles/
│   └── product.css          # Component styles
├── test/
│   └── setup.js             # Test setup (jest-dom)
├── App.jsx
├── main.jsx
└── index.css
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Run Tests

```bash
npm run test        # Single run
npm run test:watch  # Watch mode
```

### Lint

```bash
npm run lint
```

---

## Environment Setup

Create a `.env` file in the project root:

```
VITE_API_BASE_URL=http://localhost:3000
```

Replace with your backend API base URL. The app expects:

- **Endpoint:** `GET /api/products`
- **Query params:** `search`, `category`, `page`, `limit`
- **Response shape:**  
  `{ data: [{ id, title, price, image }], meta?: { totalCount, totalPages } }`  
  or an array of products.
