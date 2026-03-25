import Link from "next/link";

export function Nav() {
  return (
    <nav className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center px-6">
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg hover:opacity-80 transition-opacity">
          Researcher Kit
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/research-intake"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            Intake
          </Link>
          <Link
            href="/lit-review"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            Lit Review
          </Link>
          <Link
            href="/draft-review"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            Draft Review
          </Link>
          <a
            href="https://github.com/just-claw-it/researcher-claw-kit"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
