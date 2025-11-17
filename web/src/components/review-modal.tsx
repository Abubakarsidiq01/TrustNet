import { Button } from "@/components/ui/button";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
}

export function ReviewModal({ open, onClose }: ReviewModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 text-sm shadow-lg">
        <div className="flex items-start justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">
            How did this job go
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-neutral-500 hover:text-neutral-800"
          >
            Close
          </button>
        </div>

        {/* Quick review */}
        <div className="mt-4 space-y-1">
          <label
            htmlFor="quickReview"
            className="block text-xs font-medium text-neutral-800"
          >
            Quick review
          </label>
          <textarea
            id="quickReview"
            maxLength={140}
            placeholder="In 140 characters, what would you tell a friend about this worker"
            className="h-24 w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-neutral-900"
          />
          <div className="text-[11px] text-neutral-500">0 / 140</div>
        </div>

        {/* Sliders */}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {["Punctuality", "Communication", "Pricing fairness", "Skill"].map(
            (label) => (
              <div key={label} className="space-y-1 text-xs">
                <div className="font-medium text-neutral-800">{label}</div>
                <input type="range" min={1} max={5} defaultValue={4} className="w-full" />
                <div className="text-[11px] text-neutral-500">1 to 5</div>
              </div>
            ),
          )}
        </div>

        {/* Proof */}
        <div className="mt-4 space-y-2 text-xs">
          <div className="font-medium text-neutral-800">
            Proof (optional)
          </div>
          <button
            type="button"
            className="w-full rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-3 py-2 text-left text-neutral-600 hover:border-neutral-400"
          >
            Add a photo or receipt (optional)
          </button>
        </div>

        {/* Referral */}
        <div className="mt-4 space-y-2 text-xs">
          <div className="font-medium text-neutral-800">
            Did someone refer you to this worker?
          </div>
          <div className="flex gap-3">
            <button className="flex-1 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-center text-[11px] text-neutral-700 hover:border-neutral-900">
              Yes
            </button>
            <button className="flex-1 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-center text-[11px] text-neutral-700 hover:border-neutral-900">
              No
            </button>
          </div>
          <div className="mt-2 space-y-1">
            <label
              htmlFor="referrer"
              className="block text-[11px] font-medium text-neutral-800"
            >
              Who referred you
            </label>
            <input
              id="referrer"
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-neutral-900"
              placeholder="Choose from your contacts"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-neutral-600 hover:text-neutral-900"
          >
            Cancel
          </button>
          <Button size="sm">Submit review</Button>
        </div>
      </div>
    </div>
  );
}


