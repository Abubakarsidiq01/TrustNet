import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WorkerCard } from "@/components/worker-card";
import { sampleWorkers } from "@/lib/sample-data";

export default function SearchPage() {
  const workers = sampleWorkers;
  const selected = workers[0];

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        {/* Top bar search */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-sm font-semibold text-neutral-900">
              Search workers
            </h1>
            <Link
              href="/dashboard/client"
              className="text-xs text-neutral-600 underline-offset-2 hover:underline"
            >
              Back to dashboard
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-[2fr,1.2fr,auto]">
            <input
              placeholder="Worker or trade"
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
            />
            <input
              placeholder="Location"
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
            />
            <Button className="w-full md:w-auto">Search</Button>
          </div>

          {/* Filter row */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-neutral-700 hover:border-neutral-900">
              In my network only
            </button>
            <button className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-neutral-700 hover:border-neutral-900">
              Open to new work
            </button>
            <button className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-neutral-700 hover:border-neutral-900">
              Verified jobs only
            </button>
            <div className="flex flex-wrap gap-2">
              <select className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11px] text-neutral-700 focus:border-neutral-900">
                <option>Sort by: Trust score</option>
                <option>Sort by: Distance</option>
              </select>
              <select className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11px] text-neutral-700 focus:border-neutral-900">
                <option>Distance</option>
                <option>Within 5 km</option>
                <option>Within 10 km</option>
                <option>Within 20 km</option>
              </select>
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr),minmax(0,1.3fr)]">
          {/* Worker list */}
          <section className="space-y-3">
            <div className="text-xs text-neutral-600">
              Showing {workers.length} workers in your network
            </div>
            <div className="space-y-3">
              {workers.map((w) => (
                <div key={w.id} className="space-y-1">
                  <WorkerCard worker={w} showPath />
                  <div className="text-[11px] text-neutral-600">
                    Path to you: {w.pathToYou}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mini graph */}
          <section className="space-y-2">
            <Card className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-neutral-900">
                  How this worker connects to you
                </div>
                <Link
                  href={`/graph?focus=${encodeURIComponent(selected.id)}`}
                  className="text-xs text-neutral-600 underline-offset-2 hover:underline"
                >
                  View in full graph
                </Link>
              </div>
              <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-700">
                You → Aisha → Farouk → {selected.name}
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}


