import { NextResponse } from "next/server";
import { db } from "../../../../db";
import { users } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email aur password zaroori hain" }, { status: 400 });
    }

    // Check karein ke user pehle se to nahi hai
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return NextResponse.json({ message: "Ye email pehle se registered hai" }, { status: 400 });
    }

    // Password ko secure (hash) karein
    const hashedPassword = await bcrypt.hash(password, 10);

    // Database mein naya user save karein
    await db.insert(users).values({
      id: crypto.randomUUID(), // Automatically unique ID generate hogi
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "Account successfully ban gaya!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Kuch masla ho gaya" }, { status: 500 });
  }
}