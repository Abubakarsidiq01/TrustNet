import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapWorkerProfile } from "@/lib/workers";
import type { ClientProfileStats } from "@/lib/types";

async function buildClientStats(clientProfileId: string): Promise<ClientProfileStats> {
  const jobs = await prisma.job.findMany({
    where: { clientId: clientProfileId, status: "COMPLETED" },
    select: { workerId: true },
  });

  const uniqueWorkerIds = new Set(jobs.map((job) => job.workerId));

  const [jobsPosted, employeeReviews, workersVouching] = await Promise.all([
    prisma.job.count({ where: { clientId: clientProfileId, status: "COMPLETED" } }),
    prisma.review.count({ where: { reviewerId: clientProfileId } }),
    prisma.review.count({ where: { referrerId: clientProfileId } }),
  ]);

  return {
    peopleEmployed: uniqueWorkerIds.size,
    jobsPosted,
    employeeReviews,
    peopleConnected: uniqueWorkerIds.size,
    workersVouching,
    reviewsWritten: employeeReviews,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const role = searchParams.get("role");

    if (!userId || !role) {
      return NextResponse.json(
        { message: "User ID and role are required." },
        { status: 400 },
      );
    }

    if (role === "WORKER") {
      const workerProfile = await prisma.workerProfile.findUnique({
        where: { userId },
      });

      if (!workerProfile) {
        return NextResponse.json(
          { message: "Worker profile not found." },
          { status: 404 },
        );
      }

      const jobs = await prisma.job.findMany({
        where: {
          workerId: workerProfile.id,
          status: "PENDING",
        },
        include: {
          client: true,
        },
        orderBy: { createdAt: "desc" },
      });

      const offers = await Promise.all(
        jobs.map(async (job) => {
          const stats = await buildClientStats(job.client.id);
          return {
            jobId: job.id,
            status: job.status,
            client: {
              name: job.client.name,
              city: job.client.city,
              area: job.client.area,
              state: job.client.state,
              country: job.client.country,
              stats,
            },
          };
        }),
      );

      return NextResponse.json(
        {
          role: "WORKER",
          offers,
        },
        { status: 200 },
      );
    }

    if (role === "CLIENT") {
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { userId },
      });

      if (!clientProfile) {
        return NextResponse.json(
          { message: "Client profile not found." },
          { status: 404 },
        );
      }

      const jobs = await prisma.job.findMany({
        where: {
          clientId: clientProfile.id,
          status: "PENDING",
        },
        include: {
          worker: {
            include: {
              trustScores: {
                orderBy: { computedAt: "desc" },
                take: 1,
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const offers = jobs.map((job) => ({
        jobId: job.id,
        status: job.status,
        worker: mapWorkerProfile(job.worker),
      }));

      return NextResponse.json(
        {
          role: "CLIENT",
          offers,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Invalid role. Must be WORKER or CLIENT." },
      { status: 400 },
    );
  } catch (error) {
    console.error("[job-offers GET]", error);
    return NextResponse.json(
      { message: "Unable to load job offers right now." },
      { status: 500 },
    );
  }
}

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
    });

    if (!workerProfile) {
      return NextResponse.json(
        { message: "Worker not found." },
        { status: 404 },
      );
    }

    const jobTitle = `Job offer - ${new Date().toLocaleDateString("en-US")}`;

    const job = await prisma.job.create({
      data: {
        workerId: workerProfile.id,
        clientId: clientProfile.id,
        title: jobTitle,
        description: "Pending job offer created from the client dashboard.",
        city: clientProfile.city ?? workerProfile.city,
        area: clientProfile.area ?? workerProfile.area,
        status: "PENDING",
        verificationStatus: "UNVERIFIED",
      },
    });

    return NextResponse.json(
      {
        message: "Job offer created successfully.",
        jobId: job.id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[job-offers POST]", error);
    return NextResponse.json(
      { message: "Unable to create job offer right now." },
      { status: 500 },
    );
  }
}


