import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWorkerSummaryById, getWorkerSummaries } from "@/lib/workers";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(_: Request, { params }: RouteParams) {
  try {
    if (!params?.id) {
      return NextResponse.json({ message: "Worker ID is required." }, { status: 400 });
    }

    const worker = await prisma.workerProfile.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        trustScores: {
          orderBy: { computedAt: "desc" },
          take: 1,
        },
      },
    });

    if (!worker) {
      return NextResponse.json({ message: "Worker not found." }, { status: 404 });
    }

    const summary = await getWorkerSummaryById(worker.id);
    const peers = await getWorkerSummaries({ trade: worker.trade, limit: 5 });

    return NextResponse.json(
      {
        worker: {
          ...summary,
          email: worker.user.email,
        },
        peers: peers.filter((peer) => peer.id !== worker.id),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[workers/id GET]", error);
    return NextResponse.json(
      { message: "Unable to load that worker right now." },
      { status: 500 },
    );
  }
}


