// spec: specs/001-trip-condition-input.md § ③ カレンダーウィジェット
// Issue #7 で完全実装。本ファイルは Issue #6 用スタブ（月切替・範囲選択は #7 で実装）。

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TripDate } from "../../types/trip-conditions";

const YEAR = 2026;
const MIN_MONTH = 7;
const MAX_MONTH = 9;
const TODAY: TripDate = { month: 7, day: 11 };
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

type Props = {
  startDate: TripDate | null;
  endDate: TripDate | null;
  onSelectStart: (d: TripDate) => void;
  onSelectEnd: (d: TripDate) => void;
};

function daysInMonth(month: number): number {
  return new Date(YEAR, month, 0).getDate();
}

function firstDayOfWeek(month: number): number {
  return new Date(YEAR, month - 1, 1).getDay();
}

function compareDates(a: TripDate, b: TripDate): number {
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

function inRange(d: TripDate, start: TripDate | null, end: TripDate | null): boolean {
  if (!start || !end) return false;
  return compareDates(d, start) >= 0 && compareDates(d, end) <= 0;
}

export function TripCalendar({ startDate, endDate, onSelectStart, onSelectEnd }: Props) {
  const [currentMonth, setCurrentMonth] = useState(MIN_MONTH);

  function handleDayClick(day: number) {
    const selected: TripDate = { month: currentMonth, day };
    if (!startDate || (startDate && endDate)) {
      onSelectStart(selected);
    } else {
      if (compareDates(selected, startDate) < 0) {
        onSelectStart(selected);
      } else {
        onSelectEnd(selected);
      }
    }
  }

  const totalDays = daysInMonth(currentMonth);
  const offset = firstDayOfWeek(currentMonth);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold text-gray-400 tracking-widest uppercase">
          SELECT DATES
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentMonth((m) => Math.max(MIN_MONTH, m - 1))}
            disabled={currentMonth <= MIN_MONTH}
            className="p-1 rounded-lg cursor-pointer disabled:opacity-30 hover:bg-gray-50 transition-all"
            aria-label="前の月"
          >
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </button>
          <span className="text-xs font-extrabold text-brand-dark">
            {YEAR}年{currentMonth}月
          </span>
          <button
            type="button"
            onClick={() => setCurrentMonth((m) => Math.min(MAX_MONTH, m + 1))}
            disabled={currentMonth >= MAX_MONTH}
            className="p-1 rounded-lg cursor-pointer disabled:opacity-30 hover:bg-gray-50 transition-all"
            aria-label="次の月"
          >
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={[
              "text-center text-[10px] font-bold py-1",
              i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-400",
            ].join(" ")}
          >
            {w}
          </div>
        ))}

        {Array.from({ length: offset }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}

        {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
          const d: TripDate = { month: currentMonth, day };
          const isStart = startDate && compareDates(d, startDate) === 0;
          const isEnd = endDate && compareDates(d, endDate) === 0;
          const isInRange = inRange(d, startDate, endDate);
          const isPast = compareDates(d, TODAY) < 0;
          const dow = (offset + day - 1) % 7;

          return (
            <button
              key={day}
              type="button"
              onClick={() => !isPast && handleDayClick(day)}
              disabled={isPast}
              className={[
                "aspect-square text-[11px] font-bold rounded-lg transition-all cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed",
                isStart || isEnd
                  ? "bg-brand-orange text-white"
                  : isInRange
                    ? "bg-brand-accent text-brand-orange"
                    : dow === 0
                      ? "text-red-400 hover:bg-red-50"
                      : dow === 6
                        ? "text-blue-400 hover:bg-blue-50"
                        : "text-brand-dark hover:bg-gray-50",
              ].join(" ")}
            >
              {day}
            </button>
          );
        })}
      </div>

      {(startDate || endDate) && (
        <p className="text-[10px] text-gray-400 text-center">
          {startDate ? `${startDate.month}/${startDate.day}` : "—"}
          {" 〜 "}
          {endDate ? `${endDate.month}/${endDate.day}` : "—"}
        </p>
      )}
    </div>
  );
}
