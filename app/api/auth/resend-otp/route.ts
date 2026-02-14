import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/auth/resend-otp
 * body: { identifier }
 */
export async function POST(req: Request) {
  try {
    const { identifier } = await req.json();

    if (!identifier) {
      return NextResponse.json(
        { success: false, message: "Identifiant requis" },
        { status: 400 }
      );
    }

    /* ================= USER ================= */
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

    /* ================= NEW OTP ================= */
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.otp.create({
      data: {
        userId: user.id,
        code: otpCode,
        type: "PHONE",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    // 🔥 DEV MODE
    console.log(`📱 RESEND OTP pour ${user.phone} : ${otpCode}`);

    return NextResponse.json({
      success: true,
      message: "Code renvoyé",
    });

  } catch (error) {
    console.error("RESEND OTP ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
