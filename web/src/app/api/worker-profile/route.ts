import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 },
      );
    }

    const profile = await prisma.workerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { message: "Worker profile not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("[worker-profile GET]", error);
    return NextResponse.json(
      { message: "Unable to fetch worker profile. Please try again." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = body.userId as string | undefined;
    const name = (body.name as string | undefined)?.trim();
    const trade = (body.trade as string | undefined)?.trim();
    const city = (body.city as string | undefined)?.trim();
    const area = (body.area as string | undefined)?.trim();
    const bio = (body.bio as string | undefined)?.trim() || null;
    const skills = body.skills as string[] | undefined;
    const radiusKm = body.radiusKm as number | undefined;

    if (!userId || !name || !trade || !city || !area) {
      return NextResponse.json(
        { message: "User ID, name, trade, city, and area are required." },
        { status: 400 },
      );
    }

    // Verify user exists and is a WORKER
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    if (user.role !== "WORKER") {
      return NextResponse.json(
        { message: "Only workers can create worker profiles." },
        { status: 403 },
      );
    }

    // Check if profile already exists
    const existing = await prisma.workerProfile.findUnique({
      where: { userId },
    });

    const profileData = {
      name,
      trade,
      city,
      area,
      bio,
      skills: skills && skills.length > 0 ? skills : null,
      radiusKm: radiusKm || null,
    };

    const profile = await prisma.$transaction(async (tx) => {
      const savedProfile = existing
        ? await tx.workerProfile.update({
            where: { userId },
            data: profileData,
          })
        : await tx.workerProfile.create({
            data: {
              userId,
              ...profileData,
            },
          });

      if (user.name !== name) {
        await tx.user.update({
          where: { id: userId },
          data: { name },
        });
      }

      return savedProfile;
    });

    return NextResponse.json({ profile }, { status: existing ? 200 : 201 });
  } catch (error) {
    console.error("[worker-profile]", error);
    return NextResponse.json(
      { message: "Unable to save worker profile. Please try again." },
      { status: 500 },
    );
  }
}

