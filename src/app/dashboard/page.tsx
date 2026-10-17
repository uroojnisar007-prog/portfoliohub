

"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import {
  User,
  GraduationCap,
  Briefcase,
  LogOut,
  Save,
  Plus,
  ExternalLink,
  Trash2,
  Link as LinkIcon,
} from "lucide-react";

export default function DashboardPage() {
  // Profile Image State
  const [profileImage, setProfileImage] = useState("");

  // 1. About Me
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");

  // Social Links
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");

  // 2. Education
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");

  // 3. Projects
  const [projectList, setProjectList] = useState([
    { title: "", description: "", liveLink: "" },
  ]);

  const [savedLink, setSavedLink] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load saved profile data
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();

          if (data.userImage) {
            setProfileImage(data.userImage);
          }

          if (data.profile) {
            setUsername(data.profile.username || "");
            setTitle(data.profile.title || "");
            setBio(data.profile.bio || "");
            setSkills(data.profile.skills || "");
            setGithub(data.profile.github || "");
            setLinkedin(data.profile.linkedin || "");
            setTwitter(data.profile.twitter || "");
            setSavedLink(`http://localhost:3000/${data.profile.username}`);
          }
          if (data.education) {
            setInstitution(data.education.institution || "");
            setDegree(data.education.degree || "");
            setStartYear(data.education.startYear || "");
            setEndYear(data.education.endYear || "");
          }
          if (data.projects && data.projects.length > 0) {
            setProjectList(data.projects);
          }
        }
      } catch (error) {
        console.error("Error loading profile");
      }
    };

    loadData();
  }, []);

  // Image Upload Handler (Convert to Base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addProject = () =>
    setProjectList([
      ...projectList,
      { title: "", description: "", liveLink: "" },
    ]);

  const updateProject = (index: number, field: string, value: string) => {
    const newList = [...projectList];
    newList[index] = { ...newList[index], [field]: value };
    setProjectList(newList);
  };

  const removeProject = (index: number) =>
    setProjectList(projectList.filter((_, i) => i !== index));

  const handleSaveProfile = async () => {
    if (!username.trim()) {
      alert("Please enter a custom username first!");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: profileImage, // Added image to payload
          username: username.trim().toLowerCase(),
          title,
          bio,
          skills,
          github,
          linkedin,
          twitter,
          projects: projectList,
          education: { institution, degree, startYear, endYear },
        }),
      });

      if (res.ok) {
        setSavedLink(`http://localhost:3000/${username.trim().toLowerCase()}`);
        alert("Portfolio saved successfully!");
      } else {
        alert("Failed to save data");
      }
    } catch (error) {
      alert("Something went wrong while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  // Shared styles
  const inputClass =
    "block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-700/15";
  const labelClass = "mb-1.5 block text-base font-semibold text-slate-800";
  const cardClass =
    "flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm";
  const cardHeaderClass =
    "mb-6 flex items-center gap-3 border-b border-slate-100 pb-4";
  const iconBoxClass = "rounded-lg bg-teal-50 p-2 text-teal-800";

  return (
    <div className="min-h-screen bg-slate-100 pb-12 font-['Times_New_Roman',Times,serif] antialiased">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-teal-800">
            PortfolioHub
          </h1>

          <div className="flex min-w-0 items-center gap-4 sm:gap-6">
            {savedLink ? (
              <a
                href={savedLink}
                target="_blank"
                rel="noreferrer"
                className="flex min-w-0 items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-base font-semibold text-teal-800 transition hover:bg-teal-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/30"
              >
                <span className="hidden sm:inline">Your link:</span>
                <span className="truncate">{savedLink}</span>
                <ExternalLink size={16} aria-hidden="true" className="shrink-0" />
              </a>
            ) : (
              <span className="hidden text-base font-medium text-slate-600 sm:block">
                Save your username to get your link
              </span>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex shrink-0 items-center gap-2 rounded-lg px-2 py-1 text-base font-semibold text-slate-700 transition hover:text-red-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300/50"
            >
              <LogOut size={18} aria-hidden="true" /> Log out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h2>
          <p className="mt-1 text-lg text-slate-600">
            Manage your portfolio details below.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* About Me & Social Links */}
          <section className={cardClass} aria-labelledby="about-heading">
            <div className={cardHeaderClass}>
              <div className={iconBoxClass}>
                <User size={20} aria-hidden="true" />
              </div>
              <h3 id="about-heading" className="text-xl font-bold text-slate-900">
                About me
              </h3>
            </div>

            <div className="flex-1 space-y-4">
              {/* Profile image upload */}
              <div className="mb-6 flex flex-col items-center border-b border-slate-100 pb-6 sm:flex-row sm:gap-6">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md ring-1 ring-slate-200">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User
                      className="h-full w-full p-4 text-slate-300"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="mt-4 flex flex-1 flex-col sm:mt-0">
                  <label htmlFor="profileImage" className={labelClass}>
                    Profile picture
                  </label>
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full cursor-pointer text-base text-slate-600 transition file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:text-base file:font-semibold file:text-teal-800 hover:file:bg-teal-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/30"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="username" className={labelClass}>
                  Custom username (URL)
                </label>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 px-3 text-base text-slate-600">
                    /
                  </span>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="your-username"
                    className="block w-full flex-1 rounded-r-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-700/15"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="title" className={labelClass}>
                  Profession / title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Web Developer"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="bio" className={labelClass}>
                  Short bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a short introduction about yourself"
                  className={`${inputClass} resize-none`}
                ></textarea>
              </div>

              <div>
                <label htmlFor="skills" className={labelClass}>
                  Skills (comma separated)
                </label>
                <input
                  id="skills"
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Design, Writing, JavaScript"
                  className={inputClass}
                />
              </div>

              {/* Social links */}
              <div className="space-y-4 border-t border-slate-100 pt-6">
                <h4 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <LinkIcon size={18} aria-hidden="true" />
                  Social links
                </h4>
                <div>
                  <label htmlFor="github" className={labelClass}>
                    GitHub URL
                  </label>
                  <input
                    id="github"
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="linkedin" className={labelClass}>
                    LinkedIn URL
                  </label>
                  <input
                    id="linkedin"
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="twitter" className={labelClass}>
                    Twitter URL
                  </label>
                  <input
                    id="twitter"
                    type="url"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="https://twitter.com/..."
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-lg font-semibold text-white shadow-md transition hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-400/40 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save size={18} aria-hidden="true" />
              {isSaving ? "Saving..." : "Save profile"}
            </button>
          </section>

          {/* Education */}
          <section className={cardClass} aria-labelledby="education-heading">
            <div className={cardHeaderClass}>
              <div className={iconBoxClass}>
                <GraduationCap size={20} aria-hidden="true" />
              </div>
              <h3
                id="education-heading"
                className="text-xl font-bold text-slate-900"
              >
                Education
              </h3>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label htmlFor="institution" className={labelClass}>
                  Institution
                </label>
                <input
                  id="institution"
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="University or college name"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="degree" className={labelClass}>
                  Degree
                </label>
                <input
                  id="degree"
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. Bachelor of Science"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startYear" className={labelClass}>
                    Start year
                  </label>
                  <input
                    id="startYear"
                    type="text"
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                    placeholder="e.g. 2020"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="endYear" className={labelClass}>
                    End year
                  </label>
                  <input
                    id="endYear"
                    type="text"
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                    placeholder="e.g. 2024"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Projects */}
          <section className={cardClass} aria-labelledby="projects-heading">
            <div className={cardHeaderClass}>
              <div className={iconBoxClass}>
                <Briefcase size={20} aria-hidden="true" />
              </div>
              <h3
                id="projects-heading"
                className="text-xl font-bold text-slate-900"
              >
                Projects
              </h3>
            </div>

            <div className="max-h-[400px] flex-1 space-y-6 overflow-y-auto pr-2">
              {projectList.map((project, index) => (
                <div
                  key={index}
                  className="relative rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  {projectList.length > 1 && (
                    <button
                      onClick={() => removeProject(index)}
                      aria-label={`Remove project ${index + 1}`}
                      className="absolute right-3 top-3 rounded p-1 text-slate-500 transition hover:text-red-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600/20"
                    >
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor={`project-title-${index}`}
                        className={labelClass}
                      >
                        Project {index + 1} title
                      </label>
                      <input
                        id={`project-title-${index}`}
                        type="text"
                        value={project.title}
                        onChange={(e) =>
                          updateProject(index, "title", e.target.value)
                        }
                        placeholder="Enter project title"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`project-description-${index}`}
                        className={labelClass}
                      >
                        Description
                      </label>
                      <textarea
                        id={`project-description-${index}`}
                        rows={2}
                        value={project.description}
                        onChange={(e) =>
                          updateProject(index, "description", e.target.value)
                        }
                        placeholder="Briefly describe this project"
                        className={`${inputClass} resize-none`}
                      ></textarea>
                    </div>

                    <div>
                      <label
                        htmlFor={`project-link-${index}`}
                        className={labelClass}
                      >
                        Live URL (optional)
                      </label>
                      <input
                        id={`project-link-${index}`}
                        type="url"
                        value={project.liveLink}
                        onChange={(e) =>
                          updateProject(index, "liveLink", e.target.value)
                        }
                        placeholder="https://"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addProject}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-teal-100 bg-teal-50 px-4 py-3 text-lg font-semibold text-teal-800 transition hover:bg-teal-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/30"
            >
              <Plus size={18} aria-hidden="true" /> Add another project
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}