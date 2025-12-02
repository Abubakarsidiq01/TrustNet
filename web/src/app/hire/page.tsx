"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AuthUser, WorkerSummary } from "@/lib/types";
import { useUserStore } from "@/store/user-store";

export default function HirePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workerId = searchParams.get("workerId");
  const returnTo = searchParams.get("from") ?? "/dashboard/client";

  const { user, setUser } = useUserStore();
  const [hydrated, setHydrated] = useState(false);
  const [worker, setWorker] = useState<WorkerSummary | null>(null);
  const [loadingWorker, setLoadingWorker] = useState(true);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated) return;

    try {
      const stored = window.localStorage.getItem("trustnet:user");
      if (stored) {
        const parsed: AuthUser = JSON.parse(stored);
        setUser(parsed);
      }
    } catch {
      window.localStorage.removeItem("trustnet:user");
    } finally {
      setHydrated(true);
    }
  }, [hydrated, setUser]);

  useEffect(() => {
    if (!workerId) {
      setLoadingWorker(false);
      return;
    }

    let active = true;

    async function fetchWorker() {
      try {
        setLoadingWorker(true);
        const response = await fetch(`/api/workers/${workerId}`);
        const payload = (await response.json()) as {
          worker?: WorkerSummary;
          message?: string;
        };
        if (!response.ok) {
          throw new Error(payload?.message ?? "Unable to load worker.");
        }
        if (!active) return;
        setWorker(payload.worker ?? null);
      } catch (err) {
        if (!active) return;
        setWorker(null);
      } finally {
        if (active) {
          setLoadingWorker(false);
        }
      }
    }

    fetchWorker();

    return () => {
      active = false;
    };
  }, [workerId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user?.id) {
      setError("You need to sign in before hiring a worker.");
      return;
    }
    if (!workerId) {
      setError("No worker selected.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // This is a prototype-only flow – no real payment processing happens here.
      const response = await fetch("/api/job-offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientUserId: user.id,
          workerId,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message ?? "Unable to create job offer right now.");
      }

      router.push(returnTo);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create job offer right now.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!workerId) {
    return (
      <div className="flex min-height-screen items-center justify-center bg-slate-50 px-4">
        <Card className="w-full max-w-md space-y-3 p-6 text-center">
          <p className="text-sm font-semibold text-slate-900">
            No worker selected.
          </p>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => router.push(returnTo)}
          >
            Back to previous page
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30 px-4 py-6">
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <header className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Confirm hire
            </h1>
            <p className="text-xs text-slate-600">
              Enter your card details to send a job offer to this worker.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(returnTo)}
          >
            ← Back
          </Button>
        </header>

        <Card className="border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-lg">
          <div className="space-y-4">
            {loadingWorker ? (
              <div className="text-xs text-slate-500">
                Loading worker details...
              </div>
            ) : worker ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  You are hiring
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-900">
                  {worker.name}
                </div>
                <div className="text-xs text-slate-600">
                  {worker.trade} · {worker.locationLabel}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
                Unable to load worker details. You can still continue.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Name on card
                </label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(event) => setCardName(event.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                  placeholder="e.g. Abubakar Sanni"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Card number
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={cardNumber}
                  onChange={(event) => setCardNumber(event.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div className="grid grid-cols-[1.3fr,0.9fr] gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={(event) => setExpiry(event.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                    placeholder="04/27"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    CVC
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    required
                    value={cvc}
                    onChange={(event) => setCvc(event.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                    placeholder="123"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="mt-2 w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                disabled={submitting}
              >
                {submitting ? "Sending job offer..." : "Send job offer"}
              </Button>

              <p className="pt-1 text-[10px] text-slate-500">
                This is a prototype demo. Card details are not processed or
                stored.
              </p>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}


