"use client";

import { useEffect, useRef, useState } from "react";

/** The textarea grows with its content up to this height, then scrolls. */
const MAX_HEIGHT_PX = 200;

/**
 * Message composer with an auto-growing textarea.
 * Enter sends; Shift+Enter inserts a newline.
 */
export default function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (message: string) => void;
  disabled: boolean;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Resize the textarea to fit its content whenever the text changes.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`;
  }, [value]);

  const canSend = value.trim().length > 0 && !disabled;

  function submit() {
    if (!canSend) return;
    onSend(value.trim());
    setValue("");
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex items-end gap-2 rounded-2xl border border-slate-300 bg-white p-2 shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:focus-within:ring-indigo-900"
    >
      <label htmlFor="chat-input" className="sr-only">
        Message the coach
      </label>
      <textarea
        id="chat-input"
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          // Enter sends; Shift+Enter (or IME composition) keeps the newline.
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="Share what's on your mind… (Shift+Enter for a new line)"
        className="flex-1 resize-none bg-transparent px-2 py-2 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
        style={{ maxHeight: MAX_HEIGHT_PX }}
      />
      <button
        type="submit"
        disabled={!canSend}
        className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
      >
        Send
      </button>
    </form>
  );
}
