"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUserStore } from "@/store/user-store";
import type { AuthUser } from "@/lib/types";

export default function ClientOnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [hydrated, setHydrated] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hydrate user from localStorage
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

  // Redirect if not authenticated or not a client
  useEffect(() => {
    if (hydrated && (!user || user.role !== "CLIENT")) {
      router.push("/auth/sign-in");
    }
  }, [hydrated, user, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!user?.id) {
      setError("You must be signed in to create a profile.");
      return;
    }

    if (!name.trim() || !city.trim() || !area.trim()) {
      setError("Please fill in all required fields (name, city, area).");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/client-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          name: name.trim(),
          city: city.trim(),
          area: area.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message ?? "Unable to save profile. Please try again.");
      }

      // Refresh auth user so dashboard greets with updated info
      try {
        const refreshResponse = await fetch(`/api/users/${user.id}`);
        if (refreshResponse.ok) {
          const refreshed = (await refreshResponse.json()) as { user: AuthUser };
          setUser(refreshed.user);
          window.localStorage.setItem("trustnet:user", JSON.stringify(refreshed.user));
        }
      } catch {
        // Non-blocking refresh failure
      }

      // Success - redirect to dashboard
      router.push("/dashboard/client");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to save profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (!hydrated || !user || user.role !== "CLIENT") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <Card className="w-full max-w-sm text-center text-sm text-neutral-600">
          Loading...
        </Card>
      </div>
    );
  }

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

        <form onSubmit={handleSubmit} className="space-y-6">
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
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
                  placeholder="Abubakar"
                  required
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
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
                    placeholder="Lagos"
                    required
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
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
                    placeholder="Yaba"
                    required
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

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={loading || !name.trim() || !city.trim() || !area.trim()}>
              {loading ? "Saving..." : "Continue to dashboard"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
