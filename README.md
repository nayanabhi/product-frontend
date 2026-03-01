# Product Catalog Frontend

A production-ready React application for browsing, searching, and filtering products. Built with Vite, React 19, and a modular component architecture. All requirements are implemented with traceable evidence in the codebase.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Requirements & Supporting Evidence](#requirements--supporting-evidence)
- [Optimizations](#optimizations)
- [Additional Functionality](#additional-functionality)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment & API Contract](#environment--api-contract)
- [Production Deployment](#production-deployment)
- [Testing](#testing)
- [Future Scope](#future-scope)

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.x | UI library |
| React DOM | 19.2.x | DOM rendering |
| Vite | 7.3.x | Build tool & dev server |
| Axios | 1.13.x | HTTP client |
| Vitest | 3.2.x | Unit test runner |
| React Testing Library | 16.3.x | Component tests |
| ESLint | 9.x | Linting |

- **Node.js:** 18+
- **Package manager:** npm or yarn

---

## Requirements & Supporting Evidence

### 1. Fetch and Display Products in a Grid (Image, Title, Price)

| Evidence | Location | Description |
|----------|----------|-------------|
| **Product fetching** | `src/services/api.js` | `fetchProducts({ search, category, page, limit })` calls `GET /api/products` with query params |
| **Grid layout** | `src/components/ProductGrid.jsx` | Renders products in a `<div className="grid">`; maps each product to `ProductCard` |
| **Product display** | `src/components/ProductCard.jsx` | Renders `product.image`, `product.title`, and `product.price` (₹) per card; `loading="lazy"` on img |
| **Grid CSS** | `src/styles/product.css` | `.grid` uses CSS Grid: `repeat(2, 1fr)` on mobile; `repeat(auto-fill, minmax(220px, 1fr))` from 640px up |

---

### 2. Implement Search and Category Filter

| Evidence | Location | Description |
|----------|----------|-------------|
| **Search component** | `src/components/SearchBar.jsx` | Controlled input bound to `search`/`setSearch` from `useProducts()`; clear button when text exists; `aria-label="Search products"` |
| **Category filter** | `src/components/CategoryFilter.jsx` | `<select>` with `value={category}`, `onChange` → `setCategory`; options from API: "All categories" + `categories.map(({ category, count }) => ...)` |
| **Categories API** | `src/services/api.js` | `fetchCategories()` calls `GET /api/products/categories`; used in `ProductContext` on mount |
| **Debounced search** | `src/hooks/useDebounce.js` | `useDebounce(value, delay = 400)`; 400ms delay before updating value |
| **State integration** | `src/context/ProductContext.jsx` | `debouncedSearch` and `category` (with `page`, `limit`) trigger `fetchProducts()` in `useEffect`; page resets to 1 when search/category/limit change |
| **API params** | `src/services/api.js` | `fetchProducts()` passes `search` and `category` to backend |

---

### 3. Show Skeleton Loader While Fetching

| Evidence | Location | Description |
|----------|----------|-------------|
| **Skeleton component** | `src/components/SkeletonCard.jsx` | Placeholder card with `.skeleton-image` and `.skeleton-body` (two `.skeleton-line` blocks) |
| **Loading state** | `src/components/ProductGrid.jsx` | When `loading` is true, renders `Array.from({ length: limit }).map(() => <SkeletonCard />)` in same `.grid` layout |
| **Shimmer animation** | `src/styles/product.css` | `.skeleton-image` and `.skeleton-line` use `animation: shimmer 1.5s ease-in-out infinite`; `@keyframes shimmer` for background-position sweep |
| **Count matches limit** | `src/components/ProductGrid.jsx` | Skeleton count uses `limit` from context (5, 10, 15, or 20) so placeholder count matches items per page |

---

### 4. Responsive Layout (Flex/Grid) for Mobile and Desktop

| Evidence | Location | Description |
|----------|----------|-------------|
| **Main layout** | `src/styles/product.css` | `.container` uses `display: flex; flex-direction: column; gap: 1.5rem`; `max-width: 1280px`, `clamp` padding |
| **Product grid** | `src/styles/product.css` | Mobile: `grid-template-columns: repeat(2, 1fr)`; ≥640px: `repeat(auto-fill, minmax(220px, 1fr))`; ≥1024px: increased gap |
| **Toolbar** | `src/styles/product.css` | `.toolbar`: column on small screens; `@media (min-width: 640px)` row with `align-items: center` |
| **Pagination layout** | `src/styles/product.css` | `.pagination-info`: column on mobile; ≥640px: `flex-direction: row; justify-content: space-between` |
| **Viewport** | `index.html` | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` |

---

### 5. State Management (React Context)

| Evidence | Location | Description |
|----------|----------|-------------|
| **Product context** | `src/context/ProductContext.jsx` | `createContext`; state: `products`, `loading`, `error`, `search`, `category`, `page`, `limit`, `totalPages`, `totalCount`, `categories`, `catLoading`; actions: `setSearch`, `setCategory`, `setPage`, `setLimit`, `refetch` |
| **Provider setup** | `src/main.jsx` | App wrapped with `<ProductProvider>` so all children use same state |
| **Custom hook** | `src/context/ProductContext.jsx` | `useProducts()` returns `useContext(ProductContext)` |
| **Consumer usage** | `SearchBar`, `CategoryFilter`, `ProductGrid`, `Pagination` | All import `useProducts()` for state and setters |

---

### 6. Pagination (with Items Per Page)

| Evidence | Location | Description |
|----------|----------|-------------|
| **Pagination component** | `src/components/Pagination.jsx` | Renders when `products.length > 0`; Previous/Next; numbered page buttons via `getPageNumbers(page, totalPages)` (max 5 visible, ellipsis); first/last page shortcuts |
| **Items per page** | `src/components/Pagination.jsx` | Dropdown with `ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20]`; `limit`/`setLimit` from context |
| **Page state** | `src/context/ProductContext.jsx` | `page`, `setPage`, `limit`, `setLimit`; `useEffect` resets `page` to 1 when `debouncedSearch`, `category`, or `limit` change |
| **API integration** | `src/services/api.js` | `fetchProducts()` sends `page` and `limit`; context uses `res.meta.totalCount` / `res.meta.totalPages` (with fallbacks) |
| **Display info** | `src/components/Pagination.jsx` | "Showing X of Y products"; `aria-label` on navigation and current page (`aria-current="page"`) |

---

### 7. Unit Test for One Component (and Additional Tests)

| Evidence | Location | Description |
|----------|----------|-------------|
| **ProductCard tests** | `src/components/ProductCard.test.jsx` | Vitest + React Testing Library: (1) renders image src, heading, price with `aria-label`; (2) asserts `loading="lazy"` on img |
| **SearchBar tests** | `src/components/SearchBar.test.jsx` | Renders with placeholder; updates value on type; shows clear button when non-empty and clears on click |
| **Pagination tests** | `src/components/Pagination.test.jsx` | Returns null when no products; shows "Showing…products", Previous/Next, items-per-page select when products exist |
| **Test setup** | `src/test/setup.js` | Global test setup (e.g. jest-dom); Vitest config |
| **Run commands** | `package.json` | `npm run test` (single run), `npm run test:watch` (watch mode) |

---

## Optimizations

| Optimization | Evidence |
|--------------|----------|
| **URL state sync** | `ProductContext.jsx`: `getStateFromUrl()` reads `search`, `category`, `page`, `limit` from `URLSearchParams` on init; `syncUrlToState()` writes them with `history.replaceState`; `popstate` listener keeps state in sync with browser back/forward. Shareable links and restorable state. |
| **Debounced search** | `useDebounce.js` (400ms) and used in `ProductContext` so API is called after user stops typing, reducing request volume. |
| **Lazy-loaded images** | `ProductCard.jsx`: `loading="lazy"` on `<img>` to defer off-screen image loading. |
| **Image fallback** | `ProductCard.jsx`: `onError` hides broken img and shows placeholder (first letter of title); placeholder also used when `product.image` is missing. |
| **Stable setters** | `ProductContext.jsx`: `setSearch`, `setCategory`, `setPage`, `setLimit` wrapped in `useCallback` to avoid unnecessary re-renders. |

---

## Additional Functionality

| Feature | Location | Description |
|---------|----------|-------------|
| **Error handling** | `ProductGrid.jsx`, `ProductContext.jsx` | Error state UI with message and "Try again" button calling `refetch()`; `error` from failed `fetchProducts` (response or generic message) |
| **Empty state** | `ProductGrid.jsx` | Message when `!products?.length` and not loading: "No products found" with short hint |
| **Accessibility** | Multiple | `aria-label` on search, clear, category select, pagination, price; `aria-current="page"`; `role="navigation"` on pagination; semantic `<article>`, `<header>`, `<button>` |
| **Light/Dark mode** | `src/index.css` | CSS variables with `prefers-color-scheme: dark` media query for theme-aware colors |
| **Dynamic categories** | `api.js`, `ProductContext.jsx`, `CategoryFilter.jsx` | Categories loaded from `GET /api/products/categories` with optional count per category |

---

## Project Structure

```
src/
├── components/
│   ├── ProductCard.jsx        # Product display (image, title, price, fallback)
│   ├── ProductCard.test.jsx  # Unit tests
│   ├── ProductGrid.jsx        # Grid, loading / empty / error states
│   ├── SearchBar.jsx         # Search input + clear
│   ├── SearchBar.test.jsx    # Unit tests
│   ├── CategoryFilter.jsx    # Category dropdown (API-driven)
│   ├── Pagination.jsx        # Page numbers, Prev/Next, items per page
│   ├── Pagination.test.jsx   # Unit tests
│   └── SkeletonCard.jsx      # Loading placeholder
├── context/
│   └── ProductContext.jsx    # Global state, URL sync, fetch logic
├── hooks/
│   └── useDebounce.js       # Debounce hook (default 400ms)
├── services/
│   └── api.js               # fetchProducts, fetchCategories
├── styles/
│   └── product.css          # Component styles (Flex/Grid, responsive)
├── test/
│   └── setup.js             # Test setup (e.g. jest-dom)
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

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Environment & API Contract

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Replace with your backend API base URL. The app expects:

| Endpoint | Method | Query / body | Response |
|----------|--------|--------------|----------|
| `/api/products` | GET | `search`, `category`, `page`, `limit` | `{ data: Product[], meta?: { totalCount, totalPages } }` or array of products |
| `/api/products/categories` | GET | — | Array of `{ category: string, count?: number }` or array of category strings |

**Product shape:** `{ id, title, price, image? }` (image optional; fallback used if missing or on error).

---

## Production Deployment

- **Build:** Run `npm run build`; output is in `dist/`. Serve `dist/` with any static host (e.g. Nginx, Vercel, Netlify, S3 + CloudFront).
- **Environment:** Set `VITE_API_BASE_URL` at build time to the production API URL; Vite inlines it into the client bundle.
- **Security:** Do not put secrets in the client; only the public API base URL is needed. Prefer HTTPS and CORS configured on the API.
- **Browser support:** Targets modern evergreen browsers (ES modules, typical React 19 / Vite 7 support).

---

## Testing

- **Requirement (one component):** `ProductCard` is covered by `ProductCard.test.jsx` (render image/title/price, lazy loading).
- **Additional:** `SearchBar.test.jsx` and `Pagination.test.jsx` cover search UI and pagination behavior with mocked API.
- **Commands:**
  - `npm run test` — single run
  - `npm run test:watch` — watch mode

---

## Future Scope

1. **Infinite scroll** — Optional alternative to pagination: load more products on scroll (e.g. intersection observer) while keeping URL state for current "page" or cursor for shareability and back/forward behavior.
2. **Product detail view** — Dedicated route or modal for a single product (e.g. `/product/:id`) with full description, gallery, and add-to-cart or similar CTA, reusing the same API and context where applicable.

---

## License

Private. All rights reserved.
