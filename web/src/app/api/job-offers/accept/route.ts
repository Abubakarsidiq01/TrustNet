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
        worker: {
          include: {
            trustScores: {
              orderBy: { computedAt: "desc" },
              take: 1,
            },
            user: {
              select: { id: true },
            },
          },
        },
        client: {
          include: {
            user: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { message: "Job offer not found." },
        { status: 404 },
      );
    }

    const workerProfile = job.worker;

    if (!workerProfile || workerProfile.userId !== userId) {
      return NextResponse.json(
        { message: "You are not allowed to accept this job offer." },
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
        status: "COMPLETED",
        verificationStatus: "FULLY_VERIFIED",
      },
    });

    // Ensure the client and worker are connected in the network.
    // We always store the connection as (clientUserId -> workerUserId).
    const clientUserId = job.client?.user?.id;
    const workerUserId = workerProfile.user?.id;

    if (clientUserId && workerUserId) {
      const existingConnection = await prisma.connection.findFirst({
        where: {
          OR: [
            { userAId: clientUserId, userBId: workerUserId },
            { userAId: workerUserId, userBId: clientUserId },
          ],
        },
      });

      if (!existingConnection) {
        await prisma.connection.create({
          data: {
            userAId: clientUserId,
            userBId: workerUserId,
          },
        });
      }
    }

    const latestTrust = workerProfile.trustScores[0];

    if (latestTrust) {
      await prisma.trustScoreSnapshot.update({
        where: { id: latestTrust.id },
        data: {
          total: latestTrust.total + 2,
          verified: latestTrust.verified + 1,
          referrals: latestTrust.referrals + 1,
        },
      });
    } else {
      await prisma.trustScoreSnapshot.create({
        data: {
          workerId: workerProfile.id,
          total: 5,
          sentiment: 3,
          referrals: 1,
          verified: 1,
          freshness: 90,
        },
      });
    }

    return NextResponse.json(
      { message: "Job offer accepted and recorded." },
      { status: 200 },
    );
  } catch (error) {
    console.error("[job-offers/accept POST]", error);
    return NextResponse.json(
      { message: "Unable to accept this job offer right now." },
      { status: 500 },
    );
  }
}


