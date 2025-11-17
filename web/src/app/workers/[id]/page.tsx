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

  const getTradeColor = (trade: string) => {
    if (trade === "Electrician") return "from-amber-500 to-orange-600";
    if (trade === "Plumber") return "from-blue-500 to-cyan-600";
    if (trade === "Cleaner") return "from-emerald-500 to-teal-600";
    return "from-violet-500 to-purple-600";
  };

  if (!worker) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-6">
        <Card className="w-full max-w-md space-y-4 bg-white p-6 shadow-2xl">
          <div className="text-lg font-bold text-slate-900">Worker not found</div>
          <p className="text-sm text-slate-600">
            This profile does not exist in the current sample data.
          </p>
          <Link href="/search">
            <Button className="w-full bg-gradient-to-r from-teal-600 to-emerald-600">
              Back to search
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const peers = getWorkersByTrade(worker.trade);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30 px-4 py-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/search"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
          >
            <span>←</span> Back to results
          </Link>
          <Button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
            Request this worker
          </Button>
        </div>

        {/* Header section with gradient */}
        <section className="grid gap-6 md:grid-cols-[minmax(0,1.7fr),minmax(0,1.3fr)]">
          <Card className="bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg border-2 border-slate-200">
            <div className="flex gap-4">
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${getTradeColor(worker.trade)} text-lg font-bold text-white shadow-xl`}>
                {worker.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="space-y-2 flex-1">
                <div className="text-xl font-bold text-slate-900">{worker.name}</div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-gradient-to-r from-teal-100 to-emerald-100 px-3 py-1 text-xs font-semibold text-teal-700">
                    {worker.trade}
                  </span>
                  <span className="text-sm text-slate-500">·</span>
                  <span className="text-sm text-slate-600">{worker.locationLabel}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 font-medium text-blue-700">
                    Network: 2 steps
                  </span>
                  <span>via Aisha</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 p-6 shadow-lg border-2 border-teal-200">
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                Trust score
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                {worker.trust.total} <span className="text-lg text-slate-500">/ 100</span>
              </div>
              <div className="space-y-2 pt-2 border-t border-teal-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">Sentiment</span>
                  <span className="font-bold text-teal-600">{worker.trust.sentiment}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">Referrals</span>
                  <span className="font-bold text-blue-600">{worker.trust.referrals}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">Verified</span>
                  <span className="font-bold text-emerald-600">{worker.trust.verified}</span>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Sentiment summary */}
        <Card className="bg-gradient-to-br from-violet-50 to-purple-50 p-6 shadow-lg border-2 border-violet-200">
          <div className="space-y-4">
            <div className="text-base font-bold text-slate-900">What people keep saying</div>
            <div className="flex flex-wrap gap-2">
              {worker.sentimentTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gradient-to-r from-violet-100 to-purple-100 px-4 py-2 text-xs font-semibold text-violet-700 shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-600">
              These tags come from words people use in reviews, not what the worker writes.
            </p>
          </div>
        </Card>

        {/* Recent verified jobs */}
        <Card className="bg-white p-6 shadow-lg border-2 border-slate-200">
          <div className="space-y-4">
            <div className="text-base font-bold text-slate-900">Recent verified jobs</div>
            <div className="space-y-3">
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
                  className="flex items-center justify-between gap-4 rounded-xl border-l-4 border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      {job.date}
                    </div>
                    <div className="text-sm font-bold text-slate-900">{job.title}</div>
                    <div className="text-xs text-slate-600">
                      {job.location} · Client {job.initials}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white">
                      Verified
                    </span>
                    <button className="text-xs font-medium text-teal-600 underline-offset-2 hover:text-teal-700 hover:underline">
                      See proof
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Reviews section */}
        <Card className="bg-white p-6 shadow-lg border-2 border-slate-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-base font-bold text-slate-900">Reviews</div>
              <button
                className="text-sm font-medium text-teal-600 underline-offset-2 hover:text-teal-700 hover:underline"
                onClick={() => setOpenReview(true)}
              >
                Leave review or referral
              </button>
            </div>
            <div className="space-y-4">
              {[
                {
                  client: "Aisha",
                  when: "2 weeks ago",
                  fromReferral: true,
                  text: "Reliable, quick and explains what he is doing.",
                  ratings: { punctuality: 4, communication: 5, pricing: 4, skill: 5 },
                },
                {
                  client: "Farouk",
                  when: "1 month ago",
                  fromReferral: false,
                  text: "Neat work and fair pricing, came back next day to double check.",
                  ratings: { punctuality: 5, communication: 4, pricing: 5, skill: 5 },
                },
              ].map((r) => (
                <div
                  key={r.client + r.when}
                  className="rounded-xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                        {r.client[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{r.client}</div>
                        <div className="text-[10px] text-slate-500">{r.when}</div>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-semibold ${
                        r.fromReferral
                          ? "bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700"
                          : "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700"
                      }`}>
                      {r.fromReferral ? "From referral" : "Direct"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Punctuality</span>
                      <span className="font-bold text-amber-600">{r.ratings.punctuality}/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Communication</span>
                      <span className="font-bold text-blue-600">{r.ratings.communication}/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Pricing</span>
                      <span className="font-bold text-emerald-600">{r.ratings.pricing}/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Skill</span>
                      <span className="font-bold text-violet-600">{r.ratings.skill}/5</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-800 mb-2">{r.text}</p>
                  <button className="text-xs font-medium text-teal-600 underline-offset-2 hover:text-teal-700 hover:underline">
                    See referral path →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Category comparison */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-lg border-2 border-amber-200">
          <div className="space-y-4">
            <div className="text-base font-bold text-slate-900">
              Compared to other {worker.trade.toLowerCase()}s in Lagos
            </div>
            <CategoryStatsChart workers={peers} currentWorkerId={worker.id} />
          </div>
        </Card>

        {/* Referral path visual */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 shadow-lg border-2 border-blue-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-base font-bold text-slate-900">
                How this worker links back to you
              </div>
              <Link
                href={`/graph?focus=${encodeURIComponent(worker.id)}`}
                className="text-sm font-medium text-blue-600 underline-offset-2 hover:text-blue-700 hover:underline"
              >
                Open in full graph →
              </Link>
            </div>
            <div className="rounded-xl border-2 border-dashed border-blue-300 bg-white px-4 py-3 text-sm font-medium text-blue-700">
              You → Aisha → Farouk → {worker.name}
            </div>
          </div>
        </Card>

        {/* Bottom actions */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setOpenReview(true)}
            className="border-2"
          >
            Leave review or referral
          </Button>
          <Button
            size="lg"
            className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
          >
            Request work
          </Button>
        </div>
      </div>

      <ReviewModal open={openReview} onClose={() => setOpenReview(false)} />
    </div>
  );
}
