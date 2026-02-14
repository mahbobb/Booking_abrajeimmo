import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/auth/register
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString() || null;
    const phone = formData.get("phone_number")?.toString();
    const password = formData.get("password")?.toString();
    const avatar = formData.get("avatar") as File | null;

    /* ================= VALIDATION ================= */
    if (!name || !phone || !password) {
      return NextResponse.json(
        { success: false, message: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Mot de passe trop court (min 6 caractères)" },
        { status: 400 }
      );
    }

    /* ================= CHECK USER EXISTS ================= */
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone },
          ...(email ? [{ email }] : []),
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Utilisateur déjà existant" },
        { status: 409 }
      );
    }

    /* ================= AVATAR UPLOAD ================= */
    let avatarPath: string | null = null;

    if (avatar && avatar.size > 0) {
      const bytes = await avatar.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = avatar.name.split(".").pop() || "png";
      const fileName = `avatar_${Date.now()}.${ext}`;

      const fs = await import("fs/promises");
      const path = await import("path");

      const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "avatars"
      );

      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, fileName), buffer);

      avatarPath = `/uploads/avatars/${fileName}`;
    }

    /* ================= CREATE USER ================= */
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash: await bcrypt.hash(password, 10),
        avatar: avatarPath,
        role: "USER",
        phoneVerified: false,
        active: true,
      },
    });

    /* ================= CREATE OTP ================= */
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.otp.create({
      data: {
        userId: user.id,
        code: otpCode,
        type: "PHONE",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
      },
    });

    // 🔥 DEV MODE
    console.log(`📱 OTP pour ${user.phone} : ${otpCode}`);

    return NextResponse.json({
      success: true,
      message: "Compte créé. Code OTP envoyé.",
      userId: user.id,
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
