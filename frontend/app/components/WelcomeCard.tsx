/** Starter prompts, one per topic the coach is set up to help with. */
const STARTER_PROMPTS = [
  { topic: "Stress", prompt: "I'm feeling really stressed about work. Can you help me calm down?" },
  { topic: "Motivation", prompt: "I've lost motivation to work on my goals. How do I get it back?" },
  { topic: "Habits", prompt: "Help me build a simple morning habit I can actually stick to." },
  { topic: "Confidence", prompt: "I have a big presentation coming up and I feel nervous. Any tips?" },
];

/**
 * Shown before the first message so people know what this app is for
 * and how to use it, instead of facing an empty chat box.
 */
export default function WelcomeCard({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
      <h2 className="text-xl font-semibold">Hi there 👋 I&apos;m your Mindful Coach.</h2>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        I&apos;m an AI coach that helps with <strong>stress</strong>, <strong>motivation</strong>,{" "}
        <strong>habits</strong>, and <strong>confidence</strong>. Tell me what&apos;s on your mind
        and I&apos;ll offer encouragement and practical next steps.
      </p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Tip: I answer each message on its own and don&apos;t remember earlier ones, so include the
        context I need in every message.
      </p>

      <p className="mt-5 text-sm font-medium text-slate-700 dark:text-slate-200">Try one of these:</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {STARTER_PROMPTS.map(({ topic, prompt }) => (
          <button
            key={topic}
            type="button"
            onClick={() => onPick(prompt)}
            className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-left text-sm text-indigo-900 transition hover:border-indigo-400 hover:bg-indigo-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-100 dark:hover:bg-indigo-900"
          >
            <span className="block text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
              {topic}
            </span>
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
