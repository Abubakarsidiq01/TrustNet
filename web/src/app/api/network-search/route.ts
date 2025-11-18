import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { NetworkSearchResult } from "@/lib/types";
import { mapWorkerProfile } from "@/lib/workers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") ?? "").trim();

    if (query.length === 0) {
      return NextResponse.json({ results: [] }, { status: 200 });
    }

    const profiles = await prisma.workerProfile.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { trade: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
          { area: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        trustScores: {
          orderBy: { computedAt: "desc" },
          take: 1,
        },
        user: {
          select: {
            id: true,
          },
        },
      },
      take: 12,
    });

    const results: NetworkSearchResult[] = profiles.map((profile) => ({
      userId: profile.userId,
      summary: mapWorkerProfile(profile),
    }));

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error("[network-search]", error);
    return NextResponse.json(
      { message: "Unable to search the network right now. Please try again." },
      { status: 500 },
    );
  }
}


