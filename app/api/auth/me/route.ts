import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

/* ======================
   GET CURRENT USER
====================== */
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error("AUTH ME ERROR", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
