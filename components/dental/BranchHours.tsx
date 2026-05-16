"use client";

import type { WeeklyHours, DayKey, DayHours } from "@/lib/branches";

const GOLD = "#DAC583";
const GOLD_DARK = "#B19552";

const DAYS: { key: DayKey; label: string; jsIndex: number }[] = [
  { key: "sun", label: "Sunday", jsIndex: 0 },
  { key: "mon", label: "Monday", jsIndex: 1 },
  { key: "tue", label: "Tuesday", jsIndex: 2 },
  { key: "wed", label: "Wednesday", jsIndex: 3 },
  { key: "thu", label: "Thursday", jsIndex: 4 },
  { key: "fri", label: "Friday", jsIndex: 5 },
  { key: "sat", label: "Saturday", jsIndex: 6 },
];

function todayKey(): DayKey {
  const jsDay = new Date().getDay();
  return DAYS.find((day) => day.jsIndex === jsDay)?.key ?? "mon";
}

function formatHours(v: DayHours) {
  if (v === "closed") return "Closed";
  return `${v.open}-${v.close}`;
}

export default function BranchHours({ hours }: { hours: WeeklyHours }) {
  const currentKey = todayKey();
  const todayMeta = DAYS.find((day) => day.key === currentKey) ?? DAYS[1];
  const todayValue = formatHours(hours[currentKey]);
  const currentIndex = DAYS.findIndex((day) => day.key === currentKey);
  const listDays =
    currentIndex < 0
      ? DAYS.filter((day) => day.key !== currentKey)
      : [...DAYS.slice(currentIndex + 1), ...DAYS.slice(0, currentIndex)];

  return (
    <div className="w-full">
      <div className="text-xs text-black/60">
        <span className="font-semibold text-black/80">Hours:</span>{" "}
        <span className="font-semibold text-black/80">{todayMeta.label}</span>{" "}
        <span className="font-medium" style={{ color: GOLD_DARK }}>
          {todayValue}
        </span>
      </div>

      <div className="mt-2 overflow-hidden rounded-xl border border-black/10 bg-white">
        <div className="h-px w-full" style={{ backgroundColor: GOLD }} />

        <div className="px-4 py-3 text-sm">
          <div className="space-y-1">
            {listDays.map((day) => {
              const value = hours[day.key];
              const isClosed = value === "closed";

              return (
                <div key={day.key} className="flex items-center justify-between gap-4">
                  <span className="text-black/60">{day.label}</span>
                  <span
                    className={`tabular-nums ${
                      isClosed ? "text-black/45" : "text-black/70"
                    }`}
                  >
                    {formatHours(value)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-2 text-[11px] text-black/45">
            Clinic hours may change on holidays.
          </div>
        </div>
      </div>
    </div>
  );
}
