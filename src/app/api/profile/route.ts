import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// @ts-ignore
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "../../../db";
import { users, profiles, projects, education } from "../../../db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const userResult = await db.select().from(users).where(eq(users.email, session.user.email));
    if (userResult.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const userId = userResult[0].id;

    // 1. Profile Image Save Karein
    if (data.image) {
      await db.update(users).set({ image: data.image }).where(eq(users.id, userId));
    }

    // 2. Profile Details Save Karein
    const existingProfile = await db.select().from(profiles).where(eq(profiles.userId, userId));
    if (existingProfile.length > 0) {
      await db.update(profiles).set({
        username: data.username, title: data.title, bio: data.bio, skills: data.skills,
        github: data.github, linkedin: data.linkedin, twitter: data.twitter,
      }).where(eq(profiles.userId, userId));
    } else {
      await db.insert(profiles).values({
        userId, username: data.username, title: data.title, bio: data.bio, skills: data.skills,
        github: data.github, linkedin: data.linkedin, twitter: data.twitter,
      });
    }

    // 3. Projects Save Karein
    if (data.projects && Array.isArray(data.projects)) {
      await db.delete(projects).where(eq(projects.userId, userId));
      const validProjects = data.projects.filter((p: any) => p.title.trim() !== "");
      if (validProjects.length > 0) {
        const projectsToInsert = validProjects.map((p: any) => ({
          userId, title: p.title, description: p.description, liveLink: p.liveLink,
        }));
        await db.insert(projects).values(projectsToInsert);
      }
    }

    // 4. Education Save Karein
    if (data.education && data.education.institution) {
      await db.delete(education).where(eq(education.userId, userId));
      await db.insert(education).values({
        userId, institution: data.education.institution, degree: data.education.degree,
        startYear: data.education.startYear, endYear: data.education.endYear,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userResult = await db.select().from(users).where(eq(users.email, session.user.email));
    if (userResult.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const userId = userResult[0].id;

    const profileData = await db.select().from(profiles).where(eq(profiles.userId, userId));
    const educationData = await db.select().from(education).where(eq(education.userId, userId));
    const projectsData = await db.select().from(projects).where(eq(projects.userId, userId));

    return NextResponse.json({
      userImage: userResult[0].image || null, // Image fetch karke bhej rahe hain
      profile: profileData[0] || null,
      education: educationData[0] || null,
      projects: projectsData || []
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}