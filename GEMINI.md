# Project Architecture for Gemini Agent

This document outlines the project structure and key architectural decisions for the `bakguteh-market` monorepo, intended to assist the Gemini agent in understanding and interacting with the codebase.

## 1. Monorepo Structure

This project is a monorepo managed by `npm workspaces`. The root `package.json` defines the workspaces, allowing for centralized dependency management and script execution.

-   **Root Directory (`bakguteh-market/`):** Contains the main `package.json` for workspace configuration, `README.md`, and `GEMINI.md`.
-   **Frontend (`bakguteh-market/frontend/`):** Houses the Vite application.
-   **Backend (`bakguteh-market/backend/`):** Contains the Node.js Express API.

## 2. Frontend (Vite Application)

-   **Framework:** Vite
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS (fully responsive using utility classes and breakpoints)
-   **State Management:** Zustand (for client-side global state like shopping cart and authentication)
-   **Icon Library:** `lucide-react`

### Key Components & Pages:

-   `frontend/index.html`: The main HTML entry point for the application.
-   `frontend/src/main.tsx`: The entry point for the React application.
-   `frontend/src/pages/page.tsx`: Homepage. Displays hero section, new arrivals, and shop by series. This page has been made responsive using Tailwind CSS utility classes.
-   `frontend/src/pages/product/id/page.tsx`: Product Page. Displays product details.
-   `frontend/src/pages/(auth)/login/page.tsx`: Login Page. Handles user input for authentication, communicates with the backend API, uses `useAuthStore` for state management, and redirects to the home page upon successful login. Includes a "Resend Verification Email" option.
-   `frontend/src/pages/(auth)/register/page.tsx`: Register Page. Handles user registration and displays backend messages.
-   `frontend/src/pages/cart/page.tsx`: Cart Page. Uses `useCartStore` to display cart items.
-   `frontend/src/components/Navbar.tsx`: Main navigation, uses `useCartStore` for cart item count and `useAuthStore` to conditionally display "Login/Register" or "Logout" and user email/display name. Now responsive for mobile, with an opaque background.
-   `frontend/src/components/Footer.tsx`: Site-wide footer.
-   `frontend/src/components/LayoutWrapper.tsx`: Wraps children with Navbar and Footer, conditionally hiding them for auth pages.
-   `frontend/src/components/ProductCard.tsx`: Reusable component for displaying product information, uses `useCartStore` to add items to cart.
-   `frontend/src/lib/store.ts`: Defines Zustand stores for client-side shopping cart state (`useCartStore`), authentication state (`useAuthStore`), and wishlist state (`useWishlistStore`). `useCartStore` and `useWishlistStore` are now integrated with the backend API for persistence.

## 3. Backend (Node.js Express API)

-   **Framework:** Express.js
-   **Language:** JavaScript
-   **Entry Point:** `backend/server.js`
-   **Database Integration:** Supabase (PostgreSQL) via `@supabase/supabase-js`.
-   **Authentication:**
    -   Password hashing with `bcryptjs`.
    -   JSON Web Tokens (JWTs) with `jsonwebtoken`.
    -   Conceptual `/api/register` endpoint for user creation.
    -   `/api/login` endpoint for user authentication.
    -   `/api/resend-verification` (POST): New endpoint to resend email verification links using Supabase's `auth.resend()` method.
-   **Security:**
    -   Rate limiting with `express-rate-limit`.
    -   CORS configured to restrict access to `FRONTEND_URL` (defined in `.env`).
-   **Environment Variables:** Managed with `dotenv`.
-   **API Endpoints:**
    -   `/api/register` (POST): Conceptual user registration.
    -   `/api/login` (POST): User authentication, returns JWT.
    -   `/api/resend-verification` (POST): Resends email verification link.
    -   `/api/products` (GET): Fetches product data from Supabase.
    -   `/api/profile` (GET, PUT): Fetches and updates user profile (display name).
    -   `/api/profile/password` (PUT): Updates user password.
    -   `/api/wishlist` (GET, POST, DELETE): Manages user wishlist.
    -   `/api/cart` (GET, POST, PUT, DELETE): Manages user shopping cart.

## 4. Development Workflow

-   All `npm` commands for starting, building, and linting the frontend are defined as scripts in the `frontend/package.json` and should be run from the `bakguteh-market/frontend` directory.
-   Backend commands are in the `backend/package.json` and should be run from the `bakguteh-market/backend` directory.
-   Dependencies are managed via `npm install` from the root, leveraging `npm workspaces`.

## 5. Conventions

-   **Styling:** Tailwind CSS classes are used for all styling.
-   **Icons:** `lucide-react` is the preferred icon library.
-   **Absolute Imports:** Frontend uses `@/` alias for `frontend/src`.

## 6. Operational Guidelines

-   **Backend Server Stability:** The backend server (`backend/server.js`) should generally remain running during development. Frequent restarts can disrupt active sessions and lead to re-authentication requirements. Only restart the backend if changes are made to `backend/server.js` or its dependencies.

This `GEMINI.md` should be kept updated with any significant architectural changes or new conventions introduced in the project.