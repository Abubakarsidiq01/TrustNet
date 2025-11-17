import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WorkerCard } from "@/components/worker-card";
import { sampleNetworkStats, sampleWorkers } from "@/lib/sample-data";

export default function ClientDashboardPage() {
  const stats = sampleNetworkStats;
  const workers = sampleWorkers;

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold text-neutral-900">
            Good evening, Abubakar
          </h1>
          <p className="text-xs text-neutral-600">
            See who your network trusts before you hire.
          </p>
        </header>

        {/* Main search */}
        <Card className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-neutral-700">
            Find trusted workers
          </div>
          <div className="grid gap-3 md:grid-cols-[2fr,1.2fr,auto]">
            <input
              placeholder="Electrician, plumber, painter"
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
            />
            <input
              placeholder="Your area"
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
            />
            <Link href="/search">
              <Button className="w-full md:w-auto">Find trusted workers</Button>
            </Link>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          {/* Recommended in your network */}
          <section className="space-y-3">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">
                Workers close to your network
              </h2>
              <p className="text-xs text-neutral-600">
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
            <Card className="space-y-2">
              <div className="text-sm font-semibold text-neutral-900">
                See how trust flows to a worker
              </div>
              <p className="text-xs text-neutral-600">
                Pick a worker and we show you the exact path through your
                network.
              </p>
              <Link href="/graph">
                <Button size="sm">Open referral graph</Button>
              </Link>
            </Card>

            {/* Network snapshot */}
            <Card className="space-y-3">
              <div className="text-sm font-semibold text-neutral-900">
                Your network snapshot
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-lg font-semibold text-neutral-900">
                    {stats.peopleConnected}
                  </div>
                  <div className="text-neutral-600">People connected</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-neutral-900">
                    {stats.workersVouching}
                  </div>
                  <div className="text-neutral-600">Workers vouching</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-neutral-900">
                    {stats.reviewsWritten}
                  </div>
                  <div className="text-neutral-600">Reviews written</div>
                </div>
              </div>
              <Link
                href="/onboarding/client"
                className="text-xs text-neutral-600 underline-offset-2 hover:underline"
              >
                Invite someone you trust
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


