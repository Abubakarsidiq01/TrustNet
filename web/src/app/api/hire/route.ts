import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { clientUserId, workerId } = (await request.json()) as {
      clientUserId?: string;
      workerId?: string;
    };

    if (!clientUserId || !workerId) {
      return NextResponse.json(
        { message: "Client user ID and worker ID are required." },
        { status: 400 },
      );
    }

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: clientUserId },
    });

    if (!clientProfile) {
      return NextResponse.json(
        { message: "Client profile not found. Complete onboarding first." },
        { status: 404 },
      );
    }

    const workerProfile = await prisma.workerProfile.findUnique({
      where: { id: workerId },
      include: {
        trustScores: {
          orderBy: { computedAt: "desc" },
          take: 1,
        },
      },
    });

    if (!workerProfile) {
      return NextResponse.json({ message: "Worker not found." }, { status: 404 });
    }

    const jobTitle = `Direct hire - ${new Date().toLocaleDateString("en-US")}`;

    const job = await prisma.job.create({
      data: {
        workerId: workerProfile.id,
        clientId: clientProfile.id,
        title: jobTitle,
        description: "Direct hire recorded from the client dashboard.",
        city: clientProfile.city ?? workerProfile.city,
        area: clientProfile.area ?? workerProfile.area,
        status: "COMPLETED",
        verificationStatus: "FULLY_VERIFIED",
      },
    });

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
      {
        message: "Worker hire recorded successfully.",
        jobId: job.id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[hire POST]", error);
    return NextResponse.json(
      { message: "Unable to hire this worker right now." },
      { status: 500 },
    );
  }
}

