import type { ChatMessage } from "./types";

/**
 * A single chat bubble.
 * - User messages: right-aligned, indigo background with white text.
 * - Coach messages: left-aligned, white/slate background with dark text.
 * Bubbles size to their content (up to ~80% width) and wrap long words.
 */
export default function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm",
          "whitespace-pre-wrap break-words",
          isUser
            ? "rounded-br-sm bg-indigo-600 text-white"
            : "rounded-bl-sm border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100",
        ].join(" ")}
      >
        {!isUser && (
          <span className="mb-1 block text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            Coach
          </span>
        )}
        {message.content}
      </div>
    </div>
  );
}
