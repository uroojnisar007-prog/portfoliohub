import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "../../../../db";
import { users } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: (process.env.GITHUB_ID || process.env.GITHUB_CLIENT_ID) as string,
      clientSecret: (process.env.GITHUB_SECRET || process.env.GITHUB_CLIENT_SECRET) as string,
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "urooj@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Database se user dhoondein
        const userResult = await db.select().from(users).where(eq(users.email, credentials.email));
        const user = userResult[0];

        // Agar user na mile ya usne GitHub se login kiya ho (password na ho)
        if (!user || !user.password) return null;

        // Password check karein
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);

        if (!isValidPassword) return null;

        return { id: user.id, name: user.name, email: user.email };
      }
    })
  ],
  session: {
    strategy: "jwt", // Email/Password ke liye JWT zaroori hai
  },
  pages: {
    signIn: "/login", // Hum apna custom login page banayenge
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };