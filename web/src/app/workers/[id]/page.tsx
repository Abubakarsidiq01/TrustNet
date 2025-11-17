/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ReviewModal } from "@/components/review-modal";
import { CategoryStatsChart } from "@/components/category-stats-chart";
import { getWorkersByTrade, sampleWorkers } from "@/lib/sample-data";
import { useState } from "react";

interface WorkerProfilePageProps {
  params: { id: string };
}

export default function WorkerProfilePage({ params }: WorkerProfilePageProps) {
  const worker = sampleWorkers.find((w) => w.id === params.id);
  const [openReview, setOpenReview] = useState(false);

  if (!worker) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-6">
        <Card className="w-full max-w-md space-y-3 bg-white">
          <div className="text-sm font-semibold text-neutral-900">
            Worker not found
          </div>
          <p className="text-xs text-neutral-600">
            This profile does not exist in the current sample data.
          </p>
          <Link href="/search">
            <Button size="sm">Back to search</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const peers = getWorkersByTrade(worker.trade);

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        {/* Top bar */}
        <div className="flex items-center justify-between text-xs text-neutral-600">
          <Link href="/search" className="hover:text-neutral-900">
            ← Back to results
          </Link>
          <Button size="sm">Request this worker</Button>
        </div>

        {/* Header section */}
        <section className="grid gap-6 md:grid-cols-[minmax(0,1.7fr),minmax(0,1.3fr)]">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold text-neutral-800">
              {worker.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="space-y-1 text-sm">
              <div className="text-base font-semibold text-neutral-900">
                {worker.name}
              </div>
              <div className="text-xs text-neutral-600">
                {worker.trade} · {worker.locationLabel}
              </div>
              <div className="text-xs text-neutral-600">
                In your network: 2 steps away through Aisha
              </div>
            </div>
          </div>

          <Card className="space-y-2">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-xs text-neutral-500">Trust score</div>
                <div className="text-2xl font-semibold text-neutral-900">
                  {worker.trust.total} / 100
                </div>
              </div>
            </div>
            <div className="space-y-1 text-xs text-neutral-700">
              <div>
                <span className="font-medium">Sentiment: {worker.trust.sentiment}</span>{" "}
                <span className="text-neutral-600">
                  – Based on language from 12 reviews
                </span>
              </div>
              <div>
                <span className="font-medium">
                  Referrals: {worker.trust.referrals}
                </span>{" "}
                <span className="text-neutral-600">
                  – From 5 people in your extended network
                </span>
              </div>
              <div>
                <span className="font-medium">
                  Verified jobs: {worker.trust.verified}
                </span>{" "}
                <span className="text-neutral-600">
                  – With photo proof or invoices
                </span>
              </div>
            </div>
          </Card>
        </section>

        {/* Sentiment summary */}
        <Card className="space-y-3">
          <div className="text-sm font-semibold text-neutral-900">
            What people keep saying
          </div>
          <div className="flex flex-wrap gap-2">
            {worker.sentimentTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-800"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-xs text-neutral-600">
            These tags come from words people use in reviews, not what the
            worker writes.
          </p>
        </Card>

        {/* Recent verified jobs */}
        <Card className="space-y-3">
          <div className="text-sm font-semibold text-neutral-900">
            Recent verified jobs
          </div>
          <div className="space-y-3 text-xs text-neutral-700">
            {[
              {
                date: "Jun 2024",
                title: "Full flat rewiring",
                location: "Ikeja",
                initials: "AO",
              },
              {
                date: "May 2024",
                title: "Office lighting install",
                location: "Yaba",
                initials: "FB",
              },
              {
                date: "Apr 2024",
                title: "Fault tracing and repair",
                location: "Surulere",
                initials: "KT",
              },
            ].map((job) => (
              <div
                key={job.title}
                className="flex items-center justify-between gap-3 border-l-2 border-neutral-200 pl-3"
              >
                <div className="space-y-0.5">
                  <div className="text-[11px] text-neutral-500">{job.date}</div>
                  <div className="text-sm font-medium text-neutral-900">
                    {job.title}
                  </div>
                  <div className="text-[11px] text-neutral-600">
                    {job.location} · Client {job.initials}
                  </div>
                </div>
                <div className="text-[11px] font-medium text-emerald-700">
                  Verified
                </div>
                <button className="text-[11px] text-neutral-600 underline-offset-2 hover:underline">
                  See proof
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Reviews section */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-neutral-900">
              Reviews
            </div>
            <button
              className="text-xs text-neutral-600 underline-offset-2 hover:underline"
              onClick={() => setOpenReview(true)}
            >
              Leave review or referral
            </button>
          </div>
          <div className="space-y-3 text-xs">
            {[
              {
                client: "Aisha",
                when: "2 weeks ago",
                fromReferral: true,
                text: "Reliable, quick and explains what he is doing.",
              },
              {
                client: "Farouk",
                when: "1 month ago",
                fromReferral: false,
                text: "Neat work and fair pricing, came back next day to double check.",
              },
            ].map((r) => (
              <div
                key={r.client + r.when}
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2"
              >
                <div className="flex items-center justify-between text-[11px] text-neutral-600">
                  <div>
                    <span className="font-medium text-neutral-800">
                      {r.client}
                    </span>{" "}
                    · {r.when}
                  </div>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5">
                    {r.fromReferral ? "Came from referral" : "Direct"}
                  </span>
                </div>
                <div className="mt-2 grid gap-1 text-[11px] text-neutral-600 md:grid-cols-2">
                  <div>Punctuality: 4 of 5</div>
                  <div>Communication: 5 of 5</div>
                  <div>Pricing fairness: 4 of 5</div>
                  <div>Skill: 5 of 5</div>
                </div>
                <p className="mt-2 text-xs text-neutral-800">{r.text}</p>
                <button className="mt-1 text-[11px] text-neutral-600 underline-offset-2 hover:underline">
                  See referral path
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Category comparison */}
        <Card className="space-y-3">
          <div className="text-sm font-semibold text-neutral-900">
            Compared to other {worker.trade.toLowerCase()}s in Lagos
          </div>
          <CategoryStatsChart workers={peers} currentWorkerId={worker.id} />
        </Card>

        {/* Referral path visual */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-neutral-900">
              How this worker links back to you
            </div>
            <Link
              href={`/graph?focus=${encodeURIComponent(worker.id)}`}
              className="text-xs text-neutral-600 underline-offset-2 hover:underline"
            >
              Open in full graph
            </Link>
          </div>
          <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-700">
            You → Aisha → Farouk → {worker.name}
          </div>
        </Card>

        {/* Bottom actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" size="sm">
            Leave review or referral
          </Button>
          <Button size="sm">Request work</Button>
        </div>
      </div>

      <ReviewModal open={openReview} onClose={() => setOpenReview(false)} />
    </div>
  );
}


