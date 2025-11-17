 "use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Role = "CLIENT" | "WORKER";

export default function SignInPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("CLIENT");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (role === "CLIENT") {
      router.push("/dashboard/client");
    } else {
      router.push("/dashboard/worker");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50 md:flex-row">
      {/* Animated gradient side – desktop */}
      <div className="auth-hero-bg relative hidden flex-1 flex-col justify-between p-10 text-slate-50 md:flex">
        <div className="relative z-10 flex items-center justify-between text-xs uppercase tracking-[0.2em]">
          <span className="rounded-full border border-white/10 px-3 py-1 text-[10px]">
            TrustNet
          </span>
          <span className="text-white/60">Network-backed reputation</span>
        </div>
        <div className="relative z-10 max-w-md space-y-4">
          <p className="text-[11px] font-medium text-teal-100">
            For people who do not trust random reviews
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-slate-50">
            Sign in to see which workers your network already trusts.
          </h1>
          <p className="text-xs text-slate-200/80">
            We map referrals, verified jobs, and real sentiment into a clear,
            auditable trust graph — no star spam, no anonymous piles of ratings.
          </p>
        </div>
        <div className="relative z-10 text-[11px] text-slate-200/70">
          <p>Every connection is a real person vouching for real work.</p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-1 items-center justify-center bg-[color:var(--surface)] px-4 py-10 sm:px-6">
        <Card className="w-full max-w-md rounded-2xl border-slate-200/40 bg-[color:var(--surface-elevated)] p-6 shadow-lg sm:p-7">
          <div className="mb-4 flex items-center justify-between text-xs">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-100">
              Sign in
            </span>
            <Link
              href="/"
              className="text-[11px] text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline"
            >
              Back to home
            </Link>
          </div>

          <h2 className="text-lg font-semibold text-slate-900">
            Welcome back
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Continue as a client to find trusted workers, or as a worker to
            manage your referrals and verified jobs.
          </p>

          <div className="mt-4 flex gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => setRole("CLIENT")}
              className={`rounded-full px-3 py-1 ${
                role === "CLIENT"
                  ? "bg-slate-900 text-slate-50"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Client
            </button>
            <button
              type="button"
              onClick={() => setRole("WORKER")}
              className={`rounded-full px-3 py-1 ${
                role === "WORKER"
                  ? "bg-slate-900 text-slate-50"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Worker
            </button>
          </div>

          <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-1 text-sm">
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-800"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-teal-700"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1 text-sm">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-slate-800"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-teal-700"
                placeholder="••••••••"
              />
            </div>
            <button
              type="button"
              className="text-xs text-slate-500 underline underline-offset-2 hover:text-slate-800"
            >
              Use one time code instead
            </button>
            <Button type="submit" className="w-full">
              Continue as {role === "CLIENT" ? "client" : "worker"}
            </Button>
          </form>

          <div className="mt-4 text-center text-xs text-slate-500">
            <span>Need an account? </span>
            <Link
              href="/onboarding"
              className="font-medium text-slate-900 underline-offset-2 hover:underline"
            >
              Create account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}


