/**
 * Tiny typed client for the FastAPI backend in `/api`.
 *
 * All calls use relative URLs so the same code works locally (proxied by
 * next.config.ts) and on Vercel (routed by vercel.json).
 */

/** Shape of a successful `POST /api/chat` response. */
interface ChatResponse {
  reply: string;
}

/** FastAPI's HTTPException responses look like `{ "detail": "..." }`. */
interface ErrorResponse {
  detail?: string;
}

/** Friendly fallbacks for when the backend doesn't send a `detail` message. */
const FALLBACK_ERRORS: Record<number, string> = {
  401: "The server's AI API key looks invalid. Check your .env file.",
  429: "The coach is getting a lot of requests. Please try again in a moment.",
  500: "Something went wrong on the server. Check the backend logs.",
  502: "The AI provider couldn't be reached. Please try again shortly.",
};

/**
 * Send a single message to the coach and return its reply.
 * Throws an Error with a human-readable message on any failure.
 */
export async function sendChatMessage(message: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
  } catch {
    // Network-level failure: the backend is probably not running.
    throw new Error("Can't reach the backend. Is the API server running on port 8000?");
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ErrorResponse | null;

    // FastAPI always answers errors with JSON. A non-JSON 5xx means the dev
    // proxy couldn't reach FastAPI at all, i.e. the backend isn't running.
    if (body === null && res.status >= 500) {
      throw new Error("Can't reach the backend. Is the API server running on port 8000?");
    }

    throw new Error(
      body?.detail ?? FALLBACK_ERRORS[res.status] ?? `Request failed (HTTP ${res.status}).`,
    );
  }

  const data = (await res.json()) as ChatResponse;
  return data.reply ?? "";
}

/** Returns true when `GET /api/health` answers with `{ status: "ok" }`. */
export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch("/api/health", { cache: "no-store" });
    if (!res.ok) return false;
    const data = (await res.json()) as { status?: string };
    return data.status === "ok";
  } catch {
    return false;
  }
}
