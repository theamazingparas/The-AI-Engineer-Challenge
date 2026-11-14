import type { NextConfig } from "next";

/**
 * Where the FastAPI backend lives during local development.
 * Start it from the repo root with `uv run uvicorn api.index:app --reload`.
 * Override with API_URL if you run it on another host/port.
 */
const LOCAL_API_URL = process.env.API_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  /**
   * The UI always calls relative paths like `/api/chat`.
   * - Locally: we proxy those calls to the FastAPI dev server (no CORS needed).
   * - On Vercel: the root `vercel.json` defines two Services (this app + the FastAPI
   *   backend) and rewrites `/api/*` to the backend, so no rewrite is needed here.
   */
  async rewrites() {
    if (process.env.NODE_ENV !== "development") return [];
    return [
      {
        source: "/api/:path*",
        destination: `${LOCAL_API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
