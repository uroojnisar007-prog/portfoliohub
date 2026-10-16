"use server";

import { db } from "../db";
import { users, profiles, projects, education } from "../db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

// Profile Save Action
// Profile Save Action
export async function saveProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return;

  const userResult = await db.select().from(users).where(eq(users.email, session.user.email));
  if (userResult.length === 0) return;
  const userId = userResult[0].id;

  const username = formData.get("username") as string; // Naya field
  const title = formData.get("title") as string;
  const bio = formData.get("bio") as string;
  const skills = formData.get("skills") as string;

  const existingProfile = await db.select().from(profiles).where(eq(profiles.userId, userId));

  if (existingProfile.length > 0) {
    await db.update(profiles).set({ username, title, bio, skills }).where(eq(profiles.userId, userId));
  } else {
    await db.insert(profiles).values({ userId, username, title, bio, skills });
  }

  revalidatePath("/dashboard");
}

// Project Save Action
export async function saveProject(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return;

  const userResult = await db.select().from(users).where(eq(users.email, session.user.email));
  if (userResult.length === 0) return;
  const userId = userResult[0].id;

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const liveLink = formData.get("liveLink") as string;
  const githubLink = formData.get("githubLink") as string;

  await db.insert(projects).values({ userId, title, description, liveLink, githubLink });

  revalidatePath("/dashboard");
}

// Education Save Action (Naya Add Kiya Hai)
export async function saveEducation(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return;

  const userResult = await db.select().from(users).where(eq(users.email, session.user.email));
  if (userResult.length === 0) return;
  const userId = userResult[0].id;

  const institution = formData.get("institution") as string;
  const degree = formData.get("degree") as string;
  const startYear = formData.get("startYear") as string;
  const endYear = formData.get("endYear") as string;

  await db.insert(education).values({ userId, institution, degree, startYear, endYear });

  revalidatePath("/dashboard");
}