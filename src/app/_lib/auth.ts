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
        const email = user.email?.toLowerCase();
        if (!email) return false;

        const existingGuest = await getGuest(email);

        if (!existingGuest) {
          await createGuest({ email, fullName: user.name as string });
        }

        return true;
      } catch (error) {
        return false;
      }
    },
    async session({ session }: { session: Session }) {
      try {
        const email = session?.user?.email?.toLowerCase();
        if (!email) return session;

        const guest = await getGuest(email);
        if (guest) {
          session.user.guestId = guest.id;
        }
      } catch (error) {
        // Silent error
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
