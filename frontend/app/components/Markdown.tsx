import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Tailwind styles for each Markdown element the coach tends to use
 * (headings, lists, bold, code, tables, quotes, links).
 * Colours are explicit for light and dark mode so text always contrasts
 * with the bubble background.
 *
 * Safety: react-markdown does not render raw HTML by default, so model
 * output can't inject markup or scripts.
 */
const components: Components = {
  h1: ({ children }) => <h3 className="mt-4 mb-2 text-lg font-bold first:mt-0">{children}</h3>,
  h2: ({ children }) => <h3 className="mt-4 mb-2 text-base font-bold first:mt-0">{children}</h3>,
  h3: ({ children }) => (
    <h4 className="mt-4 mb-1.5 font-semibold text-indigo-700 first:mt-0 dark:text-indigo-300">
      {children}
    </h4>
  ),
  h4: ({ children }) => <h5 className="mt-3 mb-1 font-semibold first:mt-0">{children}</h5>,
  p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>,
  li: ({ children }) => <li className="pl-1 marker:text-indigo-500">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-900 dark:text-white">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-indigo-700 underline underline-offset-2 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-200"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-4 border-indigo-300 pl-3 text-slate-600 italic dark:border-indigo-700 dark:text-slate-300">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-4 border-slate-200 dark:border-slate-700" />,
  // Inline code; fenced blocks are wrapped by `pre` below.
  code: ({ children }) => (
    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-2 overflow-x-auto rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-900 [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  // Tables scroll sideways instead of overflowing the bubble.
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-slate-300 bg-slate-100 px-2 py-1 text-left font-semibold dark:border-slate-600 dark:bg-slate-900">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-slate-300 px-2 py-1 dark:border-slate-600">{children}</td>
  ),
};

/** Renders a Markdown string (GitHub-flavoured) with chat-friendly styles. */
export default function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
