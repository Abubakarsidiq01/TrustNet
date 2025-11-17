import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WorkerCard } from "@/components/worker-card";
import { sampleNetworkStats, sampleWorkers } from "@/lib/sample-data";

export default function ClientDashboardPage() {
  const stats = sampleNetworkStats;
  const workers = sampleWorkers;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30 px-4 py-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Good evening, Abubakar
          </h1>
          <p className="text-sm text-slate-600">
            See who your network trusts before you hire.
          </p>
        </header>

        {/* Main search */}
        <Card className="bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg border-2 border-slate-200">
          <div className="space-y-4">
            <div className="text-sm font-bold text-slate-900">
              Find trusted workers
            </div>
            <div className="grid gap-3 md:grid-cols-[2fr,1.2fr,auto]">
              <input
                placeholder="Electrician, plumber, painter"
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
              />
              <input
                placeholder="Your area"
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
              />
              <Link href="/search" className="w-full md:w-auto">
                <Button className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
                  Find trusted workers
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          {/* Recommended in your network */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Workers close to your network
              </h2>
              <p className="text-sm text-slate-600">
                Sorted by how close they are to people you trust, not just
                ratings.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {workers.map((w) => (
                <WorkerCard key={w.id} worker={w} showPath />
              ))}
            </div>
          </section>

          {/* Right side column */}
          <div className="space-y-4">
            {/* Referral path prompt */}
            <Card className="bg-gradient-to-br from-violet-50 to-purple-50 p-5 shadow-lg border-2 border-violet-200">
              <div className="space-y-3">
                <div className="text-base font-bold text-slate-900">
                  See how trust flows to a worker
                </div>
                <p className="text-sm text-slate-600">
                  Pick a worker and we show you the exact path through your
                  network.
                </p>
                <Link href="/graph">
                  <Button size="sm" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                    Open referral graph
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Network snapshot */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 shadow-lg border-2 border-blue-200">
              <div className="space-y-4">
                <div className="text-base font-bold text-slate-900">
                  Your network snapshot
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                      {stats.peopleConnected}
                    </div>
                    <div className="text-xs font-medium text-slate-600 mt-1">People connected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {stats.workersVouching}
                    </div>
                    <div className="text-xs font-medium text-slate-600 mt-1">Workers vouching</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                      {stats.reviewsWritten}
                    </div>
                    <div className="text-xs font-medium text-slate-600 mt-1">Reviews written</div>
                  </div>
                </div>
                <Link
                  href="/onboarding/client"
                  className="text-sm font-medium text-blue-600 underline-offset-2 hover:text-blue-700 hover:underline"
                >
                  Invite someone you trust
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


