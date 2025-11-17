import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { sampleWorkers } from "@/lib/sample-data";

export default function WorkerDashboardPage() {
  const worker = sampleWorkers[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30 px-4 py-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Welcome back, {worker.name.split(" ")[0]}
          </h1>
          <p className="text-sm text-slate-600">
            Grow your referrals and keep a clean record of your work.
          </p>
        </header>

        {/* Key metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 p-6 shadow-lg border-2 border-teal-200">
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-teal-700">Trust score</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                {worker.trust.total}
              </div>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 shadow-lg border-2 border-blue-200">
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-blue-700">Referrals received</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">5</div>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-violet-50 to-purple-50 p-6 shadow-lg border-2 border-violet-200">
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-violet-700">Verified jobs</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">3</div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          {/* Next trusted referral */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-900">
                Your next trusted referral
              </h2>
              <span className="text-[11px] text-neutral-500">
                Based on your recent jobs
              </span>
            </div>
            <div className="space-y-2 text-xs text-neutral-600">
              <p>
                Ask{" "}
                <span className="font-medium text-neutral-900">
                  Aisha (Yaba)
                </span>{" "}
                for a referral. She has hired you twice and is connected to 3
                other people looking for an electrician.
              </p>
              <Button size="sm" variant="outline">
                Copy referral request message
              </Button>
            </div>
          </Card>

          {/* Profile completeness */}
          <Card className="space-y-3">
            <div className="text-sm font-semibold text-neutral-900">
              Profile completeness
            </div>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li>✓ Basics filled (name, trade, location)</li>
              <li>✓ At least 1 verified job</li>
              <li>○ Upload ID or business registration</li>
              <li>○ Add 3–5 clear photos of your work</li>
            </ul>
            <Link
              href="/onboarding/worker"
              className="text-xs text-neutral-600 underline-offset-2 hover:underline"
            >
              Update profile
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}


