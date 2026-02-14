import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: Request) {
  try {
    if (!JWT_SECRET) {
      console.error("JWT_SECRET manquant");
      return NextResponse.json(
        { success: false, message: "Configuration serveur invalide" },
        { status: 500 }
      );
    }

    const { phone, password } = await req.json();

    /* ================= VALIDATION ================= */
    if (!phone || !password) {
      return NextResponse.json(
        { success: false, message: "Champs manquants" },
        { status: 400 }
      );
    }

    /* ================= USER ================= */
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    // ⚠️ Compte OTP uniquement (pas de mot de passe)
    if (!user.passwordHash) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Ce compte utilise la connexion par code OTP. Veuillez utiliser cette méthode.",
        },
        { status: 401 }
      );
    }

    /* ================= PASSWORD ================= */
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    /* ================= JWT ================= */
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    /* ================= COOKIE ================= */
    (await cookies()).set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    /* ================= RESPONSE ================= */
    return NextResponse.json({
      success: true,
      message: "Connexion réussie",
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
      redirect: "/dashboard",
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
