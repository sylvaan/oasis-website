import NextAuth, { type DefaultSession, type Session, type User } from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

// Extend the built-in session and user types
declare module "next-auth" {
  interface Session {
    user: {
      guestId?: number;
    } & DefaultSession["user"];
  }

  interface User {
    guestId?: number;
  }
}

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth }: { auth: Session | null }) {
      return !!auth?.user;
    },
    async signIn({ user }: { user: User }) {
      try {
        const existingGuest = await getGuest(user.email as string);

        if (!existingGuest) {
          await createGuest({ email: user.email as string, fullName: user.name as string });
        }

        return true;
      } catch (error) {
        console.error("Sign-in error in callback:", error);
        return false;
      }
    },
    async session({ session }: { session: Session }) {
      try {
        if (!session?.user?.email) return session;

        const guest = await getGuest(session.user.email);
        if (guest) {
          session.user.guestId = guest.id;
        }
      } catch (error) {
        console.error("Session callback error:", error);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
