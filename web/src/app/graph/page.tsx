"use client";

/* Referral graph viewer shell – UI per wireframe, with placeholder canvas */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGraphStore } from "@/store/graph-store";

export default function GraphPage() {
  const { filters } = useGraphStore();

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-sm font-semibold text-neutral-900">
            Your network trust graph
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <input
              placeholder="Search person or worker"
              className="w-52 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-neutral-900"
            />
            <Link href="/dashboard/client">
              <Button size="sm" variant="outline">
                Back to dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,2.3fr),minmax(0,1fr)]">
          {/* Graph canvas */}
          <Card className="relative min-h-[420px] bg-neutral-900/95 p-3 text-xs text-neutral-100">
            <div className="absolute left-3 top-3 flex flex-col gap-1">
              <Button size="sm" variant="outline" className="h-7 border-neutral-500 bg-neutral-900/70 text-[11px] text-neutral-100">
                + Zoom in
              </Button>
              <Button size="sm" variant="outline" className="h-7 border-neutral-500 bg-neutral-900/70 text-[11px] text-neutral-100">
                − Zoom out
              </Button>
              <Button size="sm" variant="outline" className="mt-1 h-7 border-neutral-500 bg-neutral-900/70 text-[11px] text-neutral-100">
                Fit to view
              </Button>
            </div>
            <div className="absolute bottom-3 left-3 rounded-lg bg-neutral-900/80 px-3 py-2 text-[11px] text-neutral-200">
              <div className="mb-1 font-medium">Legend</div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-300" /> You
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-300" /> Workers
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" /> Clients
                </div>
              </div>
            </div>

            {/* Placeholder for real graph component */}
            <div className="flex h-full items-center justify-center text-center text-[11px] text-neutral-300">
              <div className="max-w-xs space-y-2">
                <p className="text-neutral-100">
                  Referral graph will render here.
                </p>
                <p>
                  Nodes: You (highlighted), workers and clients from your network.
                  Hover to see tooltips. Click to open details.
                </p>
                <p className="text-neutral-400">
                  Current filters: distance {filters.distance.toLowerCase()}, min trust{" "}
                  {filters.minTrust}.
                </p>
              </div>
            </div>
          </Card>

          {/* Right filters & details */}
          <Card className="flex min-h-[420px] flex-col text-xs">
            <div className="flex gap-4 border-b border-neutral-200 pb-2 text-[11px] font-medium text-neutral-700">
              <button className="border-b-2 border-neutral-900 pb-1">
                Filters
              </button>
              <button className="pb-1 text-neutral-500">Details</button>
            </div>

            <div className="mt-3 space-y-4">
              {/* Distance slider (simple buttons) */}
              <div className="space-y-2">
                <div className="text-[11px] font-medium text-neutral-800">
                  Distance from you
                </div>
                <div className="flex flex-wrap gap-2">
                  {["You", "One step", "Two steps", "All"].map((label) => (
                    <button
                      key={label}
                      className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] text-neutral-700 hover:border-neutral-900"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust score range (simplified) */}
              <div className="space-y-2">
                <div className="text-[11px] font-medium text-neutral-800">
                  Trust score
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  defaultValue={filters.minTrust}
                  className="w-full"
                />
                <div className="flex justify-between text-[11px] text-neutral-500">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>

              {/* Trade type */}
              <div className="space-y-2">
                <div className="text-[11px] font-medium text-neutral-800">
                  Trade type
                </div>
                <select className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-[11px] text-neutral-700 focus:border-neutral-900">
                  <option>All trades</option>
                  <option>Electrician</option>
                  <option>Plumber</option>
                  <option>Cleaner</option>
                </select>
              </div>

              {/* Time range */}
              <div className="space-y-2">
                <div className="text-[11px] font-medium text-neutral-800">
                  Time period
                </div>
                <div className="flex gap-2">
                  {["Last month", "Last six months", "All time"].map((label) => (
                    <button
                      key={label}
                      className="flex-1 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] text-neutral-700 hover:border-neutral-900"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <Button size="sm" className="mt-2 w-full">
                Apply filters
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


