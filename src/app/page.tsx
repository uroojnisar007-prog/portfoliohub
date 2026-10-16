import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { connection } from "next/server"; // Required for dynamic rendering

const features = [
  "Free custom URL",
  "Easy to customize",
  "GitHub integration",
];

export default async function Home() {
  await connection();

  // If the user is already logged in, send them straight to the dashboard
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-white text-slate-900 font-['Times_New_Roman',Times,serif] antialiased selection:bg-teal-100">
      {/* Top navigation */}
      <header className="border-b border-slate-100">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5"
        >
          <Link
            href="/"
            className="rounded text-3xl font-bold tracking-tight text-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
          >
            PortfolioHub
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="rounded text-lg font-semibold text-slate-700 transition-colors hover:text-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-teal-700 px-6 py-2.5 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero section */}
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-20 text-center">
        {/* Badge */}
        <p className="mb-8 inline-block rounded-full border border-teal-100 bg-teal-50 px-5 py-2 text-base font-semibold text-teal-900">
          Showcase your work professionally
        </p>

        {/* Heading */}
        <h1 className="mx-auto mb-8 max-w-3xl text-5xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl">
          Build your professional portfolio in minutes.
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-slate-600 md:text-2xl md:leading-relaxed">
          Join developers and creatives who share their projects, skills, and
          experience through a clean, custom link. No coding required.
        </p>

        {/* Calls to action */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-xl font-semibold text-white shadow-lg transition-colors hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 sm:w-auto"
          >
            Start for free
            <ArrowRight
              size={20}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            />
          </Link>
          <Link
            href="/login"
            className="w-full rounded-full border-2 border-slate-300 bg-white px-8 py-4 text-xl font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 sm:w-auto"
          >
            View demo
          </Link>
        </div>

        {/* Feature highlights */}
        <ul className="mt-24 flex flex-wrap justify-center gap-x-12 gap-y-4 border-t border-slate-200 pt-10 text-lg font-semibold text-slate-700">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <CheckCircle2
                size={22}
                aria-hidden="true"
                className="text-teal-700"
              />
              {feature}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}