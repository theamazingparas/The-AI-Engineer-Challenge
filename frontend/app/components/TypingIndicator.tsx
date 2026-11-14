/** Three bouncing dots shown while we wait for the coach's reply. */
export default function TypingIndicator() {
  return (
    <div className="flex justify-start" role="status" aria-label="Coach is typing">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
        <span className="typing-dot h-2 w-2 rounded-full bg-indigo-500" />
        <span className="typing-dot h-2 w-2 rounded-full bg-indigo-500" />
        <span className="typing-dot h-2 w-2 rounded-full bg-indigo-500" />
        <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">Coach is typing…</span>
      </div>
    </div>
  );
}
