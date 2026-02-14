import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

/**
 * POST /api/auth/verify-otp
 * body: { identifier, otp }
 */
export async function POST(req: Request) {
  try {
    const { identifier, otp } = await req.json();

    if (!identifier || !otp) {
      return NextResponse.json(
        { success: false, message: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    /* ================= FIND USER ================= */
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ phone: identifier }, { email: identifier }],
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    /* ================= CHECK OTP ================= */
    const record = await prisma.otp.findFirst({
      where: {
        userId: user.id,
        code: otp,
        type: "PHONE",
        expiresAt: { gt: new Date() },
        used: false,
      },
    });

    if (!record) {
      return NextResponse.json(
        { success: false, message: "Code incorrect ou expiré" },
        { status: 401 }
      );
    }

    /* ================= MARK OTP USED ================= */
    await prisma.otp.update({
      where: { id: record.id },
      data: { used: true },
    });

    /* ================= VERIFY USER ================= */
    await prisma.user.update({
      where: { id: user.id },
      data: { phoneVerified: true },
    });

    /* ================= JWT ================= */
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({
      success: true,
      message: "Compte vérifié",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
      },
    });

    // 🍪 COOKIE HTTP ONLY
    res.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res;

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
