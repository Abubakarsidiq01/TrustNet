import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function WorkerOnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-6">
      <Card className="w-full max-w-xl space-y-6">
        <div className="flex items-center justify-between text-xs text-neutral-600">
          <span>Step 1 of 3</span>
          <Link href="/onboarding" className="underline-offset-2 hover:underline">
            Change role
          </Link>
        </div>
        <h1 className="text-lg font-semibold text-neutral-900">
          Set up your worker profile
        </h1>

        {/* Step 1: Basics */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-neutral-900">Basics</h2>
          <div className="grid gap-3 text-sm">
            <div className="space-y-1">
              <label
                htmlFor="fullName"
                className="block text-xs font-medium text-neutral-800"
              >
                Full name
              </label>
              <input
                id="fullName"
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
                placeholder="John Musa"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="trade"
                className="block text-xs font-medium text-neutral-800"
              >
                Trade or profession
              </label>
              <input
                id="trade"
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
                placeholder="Electrician"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label
                  htmlFor="city"
                  className="block text-xs font-medium text-neutral-800"
                >
                  City
                </label>
                <input
                  id="city"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
                  placeholder="Lagos"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="area"
                  className="block text-xs font-medium text-neutral-800"
                >
                  Area
                </label>
                <input
                  id="area"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
                  placeholder="Ikeja"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: Skills and coverage */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900">
              Skills and coverage
            </h2>
            <button className="text-xs text-neutral-600 underline-offset-2 hover:underline">
              Skip for now
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex flex-wrap gap-2">
              {["Electrical repair", "Wiring", "Installation"].map((skill) => (
                <button
                  key={skill}
                  type="button"
                  className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] text-neutral-800 hover:border-neutral-900"
                >
                  {skill}
                </button>
              ))}
              <button
                type="button"
                className="rounded-full border border-dashed border-neutral-300 px-3 py-1 text-[11px] text-neutral-600"
              >
                + Add your own
              </button>
            </div>
            <div className="mt-3 space-y-1">
              <div className="text-xs font-medium text-neutral-800">
                Coverage radius
              </div>
              <select className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-700 focus:border-neutral-900">
                <option>Within 5 km</option>
                <option>Within 10 km</option>
                <option>Within 20 km</option>
                <option>Whole city</option>
              </select>
            </div>
          </div>
        </section>

        {/* Step 3: Verification */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-neutral-900">
            Verification (optional)
          </h2>
          <p className="text-xs text-neutral-600">
            Add proof of who you are. This stays private. It only confirms you
            are real.
          </p>
          <div className="space-y-2 text-xs">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white px-3 py-2 text-left text-neutral-700 hover:border-neutral-900"
            >
              <span>Upload ID card</span>
              <span className="text-[11px] text-neutral-500">PNG, JPG, PDF</span>
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white px-3 py-2 text-left text-neutral-700 hover:border-neutral-900"
            >
              <span>Upload business registration</span>
              <span className="text-[11px] text-neutral-500">
                CAC or equivalent
              </span>
            </button>
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/dashboard/worker">
            <Button>Finish and go to dashboard</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}


