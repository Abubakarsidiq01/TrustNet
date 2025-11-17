import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { WorkerSummary } from "@/lib/types";

interface WorkerCardProps {
  worker: WorkerSummary;
  showPath?: boolean;
}

export function WorkerCard({ worker, showPath }: WorkerCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-4 text-sm shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-700">
          {worker.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div className="flex-1 space-y-1">
          <div className="font-medium text-neutral-900">{worker.name}</div>
          <div className="text-xs text-neutral-600">
            {worker.trade} · {worker.locationLabel}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-neutral-500">Trust score</div>
          <div className="text-base font-semibold text-neutral-900">
            {worker.trust.total}
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-1 text-[11px] text-neutral-600">
        <div>
          Sentiment {worker.trust.sentiment} · Referrals {worker.trust.referrals} ·
          Verified {worker.trust.verified}
        </div>
        <div className="flex flex-wrap gap-1">
          <span className="text-[11px] font-medium text-neutral-700">
            People say
          </span>
          {worker.sentimentTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px]"
            >
              {tag}
            </span>
          ))}
        </div>
        {showPath && worker.pathToYou && (
          <div className="text-[11px] text-neutral-500">
            Path to you: {worker.pathToYou}
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Link href={`/workers/${worker.id}`}>
          <Button size="sm">View profile</Button>
        </Link>
        <Link
          href={`/graph?focus=${encodeURIComponent(worker.id)}`}
          className="text-xs text-neutral-600 hover:text-neutral-900"
        >
          View in graph
        </Link>
      </div>
    </div>
  );
}


