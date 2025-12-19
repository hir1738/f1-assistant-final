import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  basePath: "/api/auth",
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email || !account?.provider) return false;

      try {
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email))
          .limit(1);

        if (existingUser.length === 0) {
          console.log("Creating new user:", user.email);
          await db.insert(users).values({
            email: user.email,
            name: user.name || null,
            image: user.image || null,
            provider: account.provider,
          });
          console.log("User created successfully");
        } else {
          console.log("Existing user found:", user.email);
        }

        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        console.error("User email:", user.email);
        console.error("Provider:", account.provider);
        return false;
      }
    },
    async session({ session }) {
      if (session.user?.email) {
        const dbUser = await db
          .select()
          .from(users)
          .where(eq(users.email, session.user.email))
          .limit(1);

        if (dbUser.length > 0) {
          session.user.id = dbUser[0].id;
        }
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
