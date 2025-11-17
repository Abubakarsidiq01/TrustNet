"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/user-store";
import type { AuthUser } from "@/lib/types";

export function ProfileButton() {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [hydrated, setHydrated] = useState(false);

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

  function handleClick() {
    if (user?.role === "CLIENT") {
      router.push("/dashboard/client");
    } else if (user?.role === "WORKER") {
      router.push("/dashboard/worker");
    } else {
      router.push("/auth/sign-in");
    }
  }

  return (
    <Button size="sm" className="px-5" onClick={handleClick}>
      Profile
    </Button>
  );
}

