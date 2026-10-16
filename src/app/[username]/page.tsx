import { db } from "../../db";
import { users, profiles, projects, education } from "../../db/schema";
import { eq } from "drizzle-orm";
import {
  ExternalLink,
  Mail,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Code2,
  UserCircle,
} from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { connection } from "next/server";
import { Metadata } from "next";

// Custom SVG Icons
const GithubIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>);
const LinkedinIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>);
const TwitterIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>);

export async function generateMetadata(props: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const params = await props.params;
  const username = params.username.toLowerCase();
  const profileResult = await db.select().from(profiles).where(eq(profiles.username, username));
  
  if (profileResult.length === 0) return { title: "Portfolio Not Found" };
  
  const profile = profileResult[0];
  const userResult = await db.select().from(users).where(eq(users.id, profile.userId));
  const user = userResult[0];

  return {
    title: `${user.name} | ${profile.title || 'Portfolio'}`,
    description: profile.bio || `Check out ${user.name}'s professional portfolio.`,
    openGraph: {
      title: `${user.name} | ${profile.title || 'Portfolio'}`,
      description: profile.bio || `Check out ${user.name}'s professional portfolio.`,
      url: `https://portfoliohub.vercel.app/${username}`,
      siteName: 'PortfolioHub',
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function PublicPortfolio(props: {
  params: Promise<{ username: string }>;
}) {
  await connection();

  const params = await props.params;
  const username = params.username.toLowerCase();

  const profileResult = await db.select().from(profiles).where(eq(profiles.username, username));
  if (profileResult.length === 0) return notFound();

  const profile = profileResult[0];
  const userId = profile.userId;

  const userResult = await db.select().from(users).where(eq(users.id, userId));
  const user = userResult[0];

  // Safe image string conversion to prevent TS errors
  const safeImage: string | undefined = user.image ? user.image : undefined;

  const userProjects = await db.select().from(projects).where(eq(projects.userId, userId));
  const userEducation = await db.select().from(education).where(eq(education.userId, userId));
  const skillsArray = profile?.skills
    ? profile.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
    : [];

  const sectionTitleClass = "text-2xl font-bold tracking-tight text-slate-900 md:text-3xl";
  const focusClass = "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0f5132]/30";

  return (
    <div className="min-h-screen bg-slate-50 font-['Times_New_Roman',Times,serif] text-slate-800 antialiased selection:bg-emerald-100">
      {/* Top navigation */}
      <header className="border-b border-slate-200 bg-white">
        <nav aria-label="Main navigation" className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 rounded text-base font-semibold text-slate-600 transition-colors hover:text-[#0f5132] ${focusClass}`}
          >
            <ArrowLeft size={16} aria-hidden="true" /> Back to dashboard
          </Link>
          <Link
            href="/"
            className={`rounded text-xl font-bold tracking-tight text-[#0f5132] ${focusClass}`}
          >
            PortfolioHub
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10 md:py-14">
        {/* Profile card */}
        <section aria-label="Profile" className="mb-16 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Banner - Teal Green Theme */}
          <div className="h-32 bg-gradient-to-r from-[#0f5132] via-[#198754] to-[#20c997] md:h-40" />

          <div className="px-6 pb-10 sm:px-10">
            {/* Profile image */}
            <div className="-mt-16 mb-5 md:-mt-20">
              {safeImage ? (
                <img
                  src={safeImage}
                  alt={user.name || "Profile"}
                  className="h-32 w-32 rounded-full border-4 border-white bg-white object-cover shadow-md md:h-40 md:w-40"
                />
              ) : (
                <UserCircle
                  aria-hidden="true"
                  className="h-32 w-32 rounded-full border-4 border-white bg-white text-slate-300 shadow-md md:h-40 md:w-40"
                  strokeWidth={1}
                />
              )}
            </div>

            <h1 className="text-4xl font-bold capitalize tracking-tight text-slate-900 md:text-5xl">
              {user.name}
            </h1>
            {profile?.title && (
              <p className="mt-2 text-xl font-semibold text-[#0f5132] md:text-2xl">
                {profile.title}
              </p>
            )}
            {profile?.bio && (
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-700 md:text-xl md:leading-relaxed">
                {profile.bio}
              </p>
            )}

            {/* Social Media Links & Contact Button */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${user.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-[#0f5132] px-8 py-3.5 text-lg font-semibold text-white shadow-md transition-colors hover:bg-[#198754] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0f5132]/40"
              >
                <Mail size={18} aria-hidden="true" /> Contact me
              </a>

              {profile?.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="rounded-full bg-slate-100 p-3.5 text-slate-700 shadow-sm transition hover:bg-emerald-50 hover:text-[#0f5132]">
                  <GithubIcon />
                </a>
              )}
              {profile?.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="rounded-full bg-slate-100 p-3.5 text-slate-700 shadow-sm transition hover:bg-emerald-50 hover:text-[#0f5132]">
                  <LinkedinIcon />
                </a>
              )}
              {profile?.twitter && (
                <a href={profile.twitter} target="_blank" rel="noreferrer" className="rounded-full bg-slate-100 p-3.5 text-slate-700 shadow-sm transition hover:bg-emerald-50 hover:text-[#0f5132]">
                  <TwitterIcon />
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Skills */}
        {skillsArray.length > 0 && (
          <section className="mb-16" aria-labelledby="skills-heading">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="rounded-lg bg-emerald-50 p-2.5 text-[#0f5132]">
                <Code2 size={22} aria-hidden="true" />
              </div>
              <h2 id="skills-heading" className={sectionTitleClass}>
                Skills
              </h2>
            </div>
            <ul className="flex flex-wrap gap-2.5">
              {skillsArray.map((skill, i) => (
                <li
                  key={i}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-base font-semibold capitalize text-[#0f5132] shadow-sm"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Education */}
        {userEducation.length > 0 && (
          <section className="mb-16" aria-labelledby="education-heading">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="rounded-lg bg-emerald-50 p-2.5 text-[#0f5132]">
                <GraduationCap size={22} aria-hidden="true" />
              </div>
              <h2 id="education-heading" className={sectionTitleClass}>
                Education
              </h2>
            </div>
            <ul className="grid gap-4">
              {userEducation.map((edu) => (
                <li
                  key={edu.id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 border-l-4 border-l-[#0f5132] bg-white p-6 shadow-sm sm:flex-row sm:items-center"
                >
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {edu.degree}
                    </h3>
                    <p className="mt-1 text-lg text-slate-600">
                      {edu.institution}
                    </p>
                  </div>
                  <p className="shrink-0 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5 text-base font-semibold text-[#0f5132]">
                    {edu.startYear} – {edu.endYear}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Projects */}
        {userProjects.length > 0 && (
          <section className="mb-8" aria-labelledby="projects-heading">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="rounded-lg bg-emerald-50 p-2.5 text-[#0f5132]">
                <Briefcase size={22} aria-hidden="true" />
              </div>
              <h2 id="projects-heading" className={sectionTitleClass}>
                Projects
              </h2>
            </div>
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {userProjects.map((proj) => (
                <li
                  key={proj.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="h-1.5 bg-gradient-to-r from-[#0f5132] to-[#20c997]" />
                  <div className="flex flex-1 flex-col p-7">
                    <div className="flex-1">
                      <h3 className="mb-3 text-xl font-bold text-slate-900">
                        {proj.title}
                      </h3>
                      <p className="text-lg leading-relaxed text-slate-700">
                        {proj.description}
                      </p>
                    </div>
                    {proj.liveLink && (
                      <div className="mt-6 border-t border-slate-100 pt-5">
                        <a
                          href={proj.liveLink}
                          target="_blank"
                          rel="noreferrer"
                          className={`inline-flex items-center gap-2 rounded text-base font-semibold text-[#0f5132] transition-colors hover:text-[#198754] hover:underline ${focusClass}`}
                        >
                          View live project{" "}
                          <ExternalLink size={16} aria-hidden="true" />
                        </a>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <p className="mx-auto max-w-4xl px-6 py-6 text-center text-base text-slate-600">
          Built with{" "}
          <Link
            href="/"
            className={`rounded font-semibold text-[#0f5132] hover:underline ${focusClass}`}
          >
            PortfolioHub
          </Link>
        </p>
      </footer>
    </div>
  );
}