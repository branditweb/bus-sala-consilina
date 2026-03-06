import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/prisma";

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase();
      if (email && adminEmails.includes(email)) {
        try {
          await prisma.user.update({
            where: { email },
            data: { role: "ADMIN" },
          });
        } catch {
          // user may not exist yet; adapter will create it
        }
      }
      return true;
    },
    async jwt({ token }) {
      if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true, email: true },
        });
        const email = dbUser?.email?.toLowerCase();
        if (email && adminEmails.includes(email) && dbUser?.role !== "ADMIN") {
          await prisma.user.update({
            where: { id: token.sub },
            data: { role: "ADMIN" },
          });
          token.role = "ADMIN";
        } else {
          token.role = dbUser?.role ?? "EDITOR";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
