import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github"
/* ===============================
   TYPES
================================ */


export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
}

export interface AuthTokenPayload extends JwtPayload {
  userId: number;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET as string;


export const { handlers, auth } = NextAuth({
  providers: [],
  session: { strategy: "jwt" },
})
/* ===============================
   GET CURRENT USER (SERVER)
================================ */
export async function getCurrentUser() {
  try {
    // ✅ OBLIGATOIRE AVEC NEXT 13+ / 14 / 15
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
}

/* ===============================
   SET COOKIE
================================ */
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });
}

/* ===============================
   CLEAR COOKIE
================================ */
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}
