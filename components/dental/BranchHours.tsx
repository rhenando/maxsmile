"use client";

import { useEffect, useMemo, useState } from "react";
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

function formatHours(v: DayHours) {
  if (v === "closed") return "Closed";
  return `${v.open}–${v.close}`;
}

export default function BranchHours({ hours }: { hours: WeeklyHours }) {
  const [todayKey, setTodayKey] = useState<DayKey>("mon");

  useEffect(() => {
    const jsDay = new Date().getDay(); // 0=Sun
    const found = DAYS.find((d) => d.jsIndex === jsDay)?.key ?? "mon";
    setTodayKey(found);
  }, []);

  const todayMeta = useMemo(
    () => DAYS.find((d) => d.key === todayKey) ?? DAYS[1],
    [todayKey],
  );

  // ✅ list order like screenshot:
  // header = today, list = next days (Thu..Tue when today is Wed)
  const listDays = useMemo(() => {
    const idx = DAYS.findIndex((d) => d.key === todayKey);
    if (idx < 0) return DAYS.filter((d) => d.key !== todayKey);
    const after = DAYS.slice(idx + 1);
    const before = DAYS.slice(0, idx);
    return [...after, ...before]; // excludes today
  }, [todayKey]);

  const todayValue = formatHours(hours[todayKey]);

  return (
    <div className='w-full'>
      {/* header row like your layout */}
      <div className='text-xs text-black/60'>
        <span className='font-semibold text-black/80'>Hours:</span>{" "}
        <span className='font-semibold text-black/80'>{todayMeta.label}</span>{" "}
        <span className='font-medium' style={{ color: GOLD_DARK }}>
          {todayValue}
        </span>
      </div>

      {/* list card that matches your UI */}
      <div className='mt-2 overflow-hidden rounded-2xl border border-black/10 bg-white'>
        {/* subtle top accent bar like your gold dividers */}
        <div className='h-px w-full' style={{ backgroundColor: GOLD }} />

        <div className='px-4 py-3 text-sm'>
          <div className='space-y-1'>
            {listDays.map((d) => {
              const v = hours[d.key];
              const isClosed = v === "closed";

              return (
                <div key={d.key} className='flex items-center justify-between'>
                  <span className='text-black/60'>{d.label}</span>
                  <span
                    className={`tabular-nums ${
                      isClosed ? "text-black/45" : "text-black/70"
                    }`}
                  >
                    {formatHours(v)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* optional: tiny note style you already use */}
          <div className='mt-2 text-[11px] text-black/45'>
            Clinic hours may change on holidays.
          </div>
        </div>
      </div>
    </div>
  );
}
