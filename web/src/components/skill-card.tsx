import Link from "next/link";

export function SkillCard({
  title,
  description,
  href,
  step,
}: {
  title: string;
  description: string;
  href: string;
  step: number;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-bold">
          {step}
        </span>
        <h3 className="text-lg font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
      <div className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
        Try it &rarr;
      </div>
    </Link>
  );
}
