import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabaseAdmin } from "@/lib/supabase-server";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        await supabaseAdmin.from("profiles").upsert({
          email: user.email,
          name: user.name,
          image: user.image,
        }, { onConflict: "email" });
      }
      return true;
    },
    async jwt({ token }) {
      if (token.email) {
        const { data } = await supabaseAdmin
          .from("profiles")
          .select("role,id")
          .eq("email", token.email)
          .single();
        if (data) {
          (token as any).role = data.role;
          (token as any).profileId = data.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = (token as any).role || "customer";
        (session.user as any).profileId = (token as any).profileId || null;
      }
      return session;
    },
  },
};
