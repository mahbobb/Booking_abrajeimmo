import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/* ======================
   CREATE AD
====================== */
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      title,
      description,
      price,
      surface,
      rooms,
      address,
      hidePhone,
      categoryId,
      subcategoryId,
      cityId,
      sectorId,
      images,
    } = body;

    if (!title || !address || !categoryId || !cityId) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    const ad = await prisma.ad.create({
      data: {
        title,
        description,
        price,
        surface,
        rooms,
        address,
        hidePhone: hidePhone ?? false,
        userId: user.id,
        categoryId: Number(categoryId),
        subcategoryId: subcategoryId ? Number(subcategoryId) : null,
        cityId: Number(cityId),
        sectorId: sectorId ? Number(sectorId) : null,
        images: images?.length
          ? {
              create: images.map((url: string) => ({ url })),
            }
          : undefined,
      },
      include: {
        images: true,
        city: true,
        category: true,
      },
    });

    return NextResponse.json(ad, { status: 201 });
  } catch (error) {
    console.error("CREATE AD ERROR", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ======================
   LIST ADS
====================== */
export async function GET() {
  const ads = await prisma.ad.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: true,
      city: true,
      category: true,
    },
  });

  return NextResponse.json(ads);
}
