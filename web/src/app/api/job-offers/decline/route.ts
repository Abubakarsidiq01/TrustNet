import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { jobId, userId } = (await request.json()) as {
      jobId?: string;
      userId?: string;
    };

    if (!jobId || !userId) {
      return NextResponse.json(
        { message: "Job ID and user ID are required." },
        { status: 400 },
      );
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        worker: true,
      },
    });

    if (!job) {
      return NextResponse.json(
        { message: "Job offer not found." },
        { status: 404 },
      );
    }

    if (!job.worker || job.worker.userId !== userId) {
      return NextResponse.json(
        { message: "You are not allowed to decline this job offer." },
        { status: 403 },
      );
    }

    if (job.status !== "PENDING") {
      return NextResponse.json(
        { message: "This job offer is no longer pending." },
        { status: 400 },
      );
    }

    await prisma.job.update({
      where: { id: job.id },
      data: {
        status: "CANCELLED",
      },
    });

    return NextResponse.json(
      { message: "Job offer declined." },
      { status: 200 },
    );
  } catch (error) {
    console.error("[job-offers/decline POST]", error);
    return NextResponse.json(
      { message: "Unable to decline this job offer right now." },
      { status: 500 },
    );
  }
}


