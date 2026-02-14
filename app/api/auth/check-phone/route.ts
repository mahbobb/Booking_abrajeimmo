import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/auth/check-phone
 * body: { phone }
 */
export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Téléphone requis" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { phone },
    });

    // 👉 UTILISATEUR EXISTE → demander mot de passe
    if (user) {
      return NextResponse.json({
        success: true,
        step: "PASSWORD",
        message: "Utilisateur existant",
      });
    }

    // 👉 UTILISATEUR N'EXISTE PAS → inscription
    return NextResponse.json({
      success: true,
      step: "REGISTER",
      message: "Utilisateur inexistant",
    });

  } catch (error) {
    console.error("CHECK PHONE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
