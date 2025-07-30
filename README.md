# Bak Guteh Market

## Project Overview

Bak Guteh Market is an e-commerce website project designed to sell anime merchandise. It is structured as a monorepo, containing both a Vite frontend application and a Node.js Express backend API.

## Architecture

This project follows a monorepo architecture managed by `npm workspaces`.

-   **Frontend (`/frontend`):** A Vite application built with TypeScript and Tailwind CSS. It provides the user interface for browsing products, managing a shopping cart, and user authentication.
-   **Backend (`/backend`):** A Node.js Express API that handles user authentication, product data fetching from Supabase, and other backend logic.

### Key Features Implemented:

-   **Vite Frontend:**
    -   TypeScript for type safety.
    -   Tailwind CSS for styling, with a focus on responsiveness across all components.
    -   `lucide-react` for icons.
    -   Reusable `ProductCard` component.
    -   Client-side shopping cart state management using Zustand, now with backend persistence.
    -   Responsive `Navbar` with cart item count and user display name/email.
    -   Responsive `Footer`.
    -   Homepage (`/`) with Hero, New Arrivals, and Shop by Series sections, designed to be fully responsive.
    -   Dynamic Product Listing Page (`/category/slug`) with placeholder filters.
    -   Product Page (`/product/id`) with product details.
    -   User Profile Page (`/profile`) allowing display name and password updates, with enhanced UI.
    -   Wishlist functionality with visual indicators and toggle to add/remove items, backed by API persistence.
    -   Cart functionality with visual indicators, backed by API persistence.

-   **Node.js Backend:**
    -   Express.js for API creation.
    -   **Supabase Integration:** Connects to a PostgreSQL database on Supabase for data storage.
    -   **Secure Authentication:** Implements password hashing (`bcryptjs`), JSON Web Tokens (JWTs) for session management (`jsonwebtoken`).
    -   **Rate Limiting:** Protects against brute-force attacks (`express-rate-limit`).
    -   **Secure CORS:** Configured to restrict access to the frontend's domain.
    -   Environment variable management (`dotenv`).
    -   `/api/login` endpoint for user authentication.
    -   `/api/register` endpoint for user registration (conceptual).
    -   `/api/products` endpoint to fetch product data from Supabase.

## Technologies Used

-   **Frontend:** Vite, React, TypeScript, Tailwind CSS, Zustand, Lucide React
-   **Backend:** Node.js, Express.js, bcryptjs, jsonwebtoken, express-rate-limit, dotenv, @supabase/supabase-js
-   **Database:** Supabase (PostgreSQL)
-   **Monorepo Management:** npm Workspaces

## Setup Instructions

To get this project up and running on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd bakguteh-market
    ```

2.  **Supabase Setup:**
    -   Create a new project on [Supabase](https://supabase.com/).
    -   Create a `products` table in your Supabase project and add some sample data.
    -   Ensure Row Level Security (RLS) policies allow `SELECT` for the `anon` role on your `products` table.
    -   Copy your Supabase Project URL and `anon` key.

3.  **Environment Variables:**
    -   Create a `.env` file in the `backend/` directory.
    -   Add the following variables, replacing the placeholders with your actual values:
        ```
        JWT_SECRET=YOUR_STRONG_RANDOM_JWT_SECRET_KEY
        FRONTEND_URL=http://localhost:5173
        SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
        SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
        ```

4.  **Install Dependencies:**
    Navigate to the root of the project and install all dependencies for both frontend and backend using npm workspaces:
    ```bash
    npm install
    ```

## Running the Application

From the root of the `bakguteh-market` directory:

1.  **Start the Backend Server:**
    ```bash
    npm run dev:backend
    ```
    This will start the Node.js Express server on `http://localhost:5001`. **Note: The backend server should generally remain running during development. Only restart it if changes are made to `backend/server.js` or its dependencies.**

2.  **Start the Frontend Development Server:**
    ```bash
    npm run dev:frontend
    ```
    This will start the Vite development server on `http://localhost:5173`. Open your browser and navigate to this address to see the application.

## Development Scripts

All scripts are run from the root `bakguteh-market` directory using `npm run <script-name>`.

-   `npm run dev:frontend`: Starts the Vite development server.
-   `npm run build:frontend`: Builds the Vite frontend for production.
-   `npm run preview:frontend`: Previews the production build.
-   `npm run lint:frontend`: Runs ESLint for the frontend.
-   `npm run dev:backend`: Starts the Node.js Express backend server.
-   `npm install:all`: Installs all dependencies for both workspaces (same as `npm install` from root).