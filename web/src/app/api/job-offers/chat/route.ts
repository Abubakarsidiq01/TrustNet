import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { message: "Job ID is required." },
        { status: 400 },
      );
    }

    const messages = await prisma.message.findMany({
      where: { jobId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const formatted = messages.map((message) => ({
      id: message.id,
      jobId: message.jobId,
      senderId: message.senderId,
      senderName: message.sender.name,
      text: message.text,
      createdAt: message.createdAt,
    }));

    return NextResponse.json({ messages: formatted }, { status: 200 });
  } catch (error) {
    console.error("[job-offers/chat GET]", error);
    return NextResponse.json(
      { message: "Unable to load chat messages right now." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { jobId, senderUserId, text } = (await request.json()) as {
      jobId?: string;
      senderUserId?: string;
      text?: string;
    };

    if (!jobId || !senderUserId || !text || text.trim().length === 0) {
      return NextResponse.json(
        { message: "Job ID, sender, and message text are required." },
        { status: 400 },
      );
    }

    // For this prototype we keep the chat logic simple and skip strict
    // authorization checks – any logged-in user who can see the job card
    // can send messages tied to that job.
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true },
    });

    if (!job) {
      return NextResponse.json(
        { message: "Job offer not found." },
        { status: 404 },
      );
    }

    const message = await prisma.message.create({
      data: {
        jobId,
        senderId: senderUserId,
        text: text.trim(),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: {
          id: message.id,
          jobId: message.jobId,
          senderId: message.senderId,
          senderName: message.sender.name,
          text: message.text,
          createdAt: message.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[job-offers/chat POST]", error);
    return NextResponse.json(
      { message: "Unable to send this message right now." },
      { status: 500 },
    );
  }
}


