import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WorkerCard } from "@/components/worker-card";
import { sampleWorkers } from "@/lib/sample-data";

export default function SearchPage() {
  const workers = sampleWorkers;
  const selected = workers[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30 px-4 py-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        {/* Top bar search */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Search workers
            </h1>
            <Link
              href="/dashboard/client"
              className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
            >
              ← Back to dashboard
            </Link>
          </div>

          <Card className="bg-gradient-to-br from-white to-slate-50 p-5 shadow-lg border-2 border-slate-200">
            <div className="grid gap-3 md:grid-cols-[2fr,1.2fr,auto]">
              <input
                placeholder="Worker or trade"
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
              />
              <input
                placeholder="Location"
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
              />
              <Button className="w-full md:w-auto bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
                Search
              </Button>
            </div>
          </Card>

          {/* Filter row */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button className="rounded-full border-2 border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50 px-4 py-2 font-semibold text-teal-700 hover:border-teal-400 hover:shadow-md transition-all">
              In my network only
            </button>
            <button className="rounded-full border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 font-semibold text-blue-700 hover:border-blue-400 hover:shadow-md transition-all">
              Open to new work
            </button>
            <button className="rounded-full border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 font-semibold text-emerald-700 hover:border-emerald-400 hover:shadow-md transition-all">
              Verified jobs only
            </button>
            <div className="flex flex-wrap gap-2">
              <select className="rounded-full border-2 border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50 px-4 py-2 text-xs font-semibold text-violet-700 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 transition-all">
                <option>Sort by: Trust score</option>
                <option>Sort by: Distance</option>
              </select>
              <select className="rounded-full border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 text-xs font-semibold text-amber-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all">
                <option>Distance</option>
                <option>Within 5 km</option>
                <option>Within 10 km</option>
                <option>Within 20 km</option>
              </select>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1.3fr)]">
          {/* Worker list */}
          <section className="space-y-4">
            <div className="text-sm font-semibold text-slate-700">
              Showing <span className="font-bold text-teal-600">{workers.length}</span> workers in your network
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
          <section className="space-y-4">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 shadow-lg border-2 border-blue-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-base font-bold text-slate-900">
                    How this worker connects to you
                  </div>
                  <Link
                    href={`/graph?focus=${encodeURIComponent(selected.id)}`}
                    className="text-sm font-medium text-blue-600 underline-offset-2 hover:text-blue-700 hover:underline"
                  >
                    Full graph →
                  </Link>
                </div>
                <div className="rounded-xl border-2 border-dashed border-blue-300 bg-white px-4 py-3 text-sm font-semibold text-blue-700">
                  You → Aisha → Farouk → {selected.name}
                </div>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}


