import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ClientOnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-6">
      <Card className="w-full max-w-xl space-y-6">
        <div className="flex items-center justify-between text-xs text-neutral-600">
          <span>Step 1 of 2</span>
          <Link href="/onboarding" className="underline-offset-2 hover:underline">
            Change role
          </Link>
        </div>
        <h1 className="text-lg font-semibold text-neutral-900">
          Set up your client profile
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
                placeholder="Abubakar"
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
                  placeholder="Yaba"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: Import people you trust */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-neutral-900">
            Import people you trust
          </h2>
          <p className="text-xs text-neutral-600">
            We never message anyone without clear consent inside the app.
          </p>
          <div className="space-y-2 text-xs">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white px-3 py-2 text-left hover:border-neutral-900"
            >
              <span className="font-medium text-neutral-800">
                Phone contacts
              </span>
              <span className="text-[11px] text-neutral-500">
                Connect contacts
              </span>
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white px-3 py-2 text-left hover:border-neutral-900"
            >
              <span className="font-medium text-neutral-800">
                Google contacts
              </span>
              <span className="text-[11px] text-neutral-500">
                Connect Google
              </span>
            </button>
            <button
              type="button"
              className="w-full rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-3 py-2 text-left text-neutral-600 hover:border-neutral-400"
            >
              Skip for now
            </button>
          </div>
        </section>

        <div className="flex justify-end pt-2">
          <Link href="/dashboard/client">
            <Button>Continue to dashboard</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}


