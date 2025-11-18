"use client";

import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import type { ClientProfileStats } from "@/lib/types";

interface ClientCardProps {
  name: string;
  city: string;
  area: string;
  badgeLabel?: string;
  stats: ClientProfileStats;
  footer?: ReactNode;
}

const statMeta: Array<{ key: keyof ClientProfileStats; label: string; gradient: string }> = [
  { key: "peopleEmployed", label: "People Employed", gradient: "from-teal-600 to-emerald-600" },
  { key: "jobsPosted", label: "Jobs Posted", gradient: "from-blue-600 to-cyan-600" },
  { key: "employeeReviews", label: "Employee Reviews", gradient: "from-violet-600 to-purple-600" },
  { key: "peopleConnected", label: "People Connected", gradient: "from-amber-600 to-orange-600" },
  { key: "workersVouching", label: "Workers Vouching", gradient: "from-indigo-600 to-blue-600" },
  { key: "reviewsWritten", label: "Reviews Written", gradient: "from-pink-600 to-rose-600" },
];

export function ClientCard({
  name,
  city,
  area,
  badgeLabel = "Client",
  stats,
  footer,
}: ClientCardProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="group flex flex-col justify-between rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 text-sm shadow-md transition-all hover:border-teal-400 hover:shadow-xl">
      <div className="flex items-start gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-lg font-bold text-white shadow-lg">
          {initials}
        </div>
        <div className="flex-1 space-y-2">
          <div className="text-2xl font-semibold text-slate-900">{name}</div>
          <div className="flex items-center gap-2 text-sm">
            <span className="rounded-full bg-teal-100 px-3 py-1 font-medium text-teal-700">
              {badgeLabel}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-600">
              {area}, {city}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {statMeta.map((item) => (
            <div key={item.key} className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {item.label}
              </div>
              <div
                className={`text-3xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}
              >
                {stats[item.key]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {footer && <div className="mt-8 border-t border-slate-200 pt-6">{footer}</div>}
    </Card>
  );
}


