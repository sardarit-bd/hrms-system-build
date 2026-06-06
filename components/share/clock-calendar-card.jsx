"use client";

import { useMemo, useState } from "react";
import { Clock } from "lucide-react";

export function ClockCalendarCard({ currentTime = new Date() }) {
  const [viewDate, setViewDate] = useState(new Date());

  const today = currentTime.getDate();
  const currentMonth = currentTime.getMonth();
  const currentYear = currentTime.getFullYear();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const hours = currentTime.getHours() % 12;
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  const monthName = viewDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const startBlank = firstDay === 0 ? 6 : firstDay - 1;

    return [
      ...Array(startBlank).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
  }, [year, month]);

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const isCurrentMonth = month === currentMonth && year === currentYear;

  return (
    <div className="overflow-hidden rounded-3xl bg-slate-900 shadow-lg">
      <div className="bg-[url('/dashboard-clock.png')] bg-cover bg-center">
        <div className="grid min-h-[360px] grid-cols-1 bg-slate-950/70 text-white lg:grid-cols-2">
          <div className="flex flex-col items-center justify-center border-b border-white/20 p-8 lg:border-b-0 lg:border-r">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-4 border-white/20">
              {[...Array(12)].map((_, i) => (
                <span
                  key={i}
                  className="absolute h-2 w-1 rounded-full bg-white/80"
                  style={{
                    transform: `rotate(${i * 30}deg) translateY(-70px)`,
                  }}
                />
              ))}

              <div
                className="absolute left-1/2 top-1/2 h-1 w-12 origin-left rounded-full bg-white"
                style={{ transform: `rotate(${hourDeg - 90}deg)` }}
              />
              <div
                className="absolute left-1/2 top-1/2 h-1 w-16 origin-left rounded-full bg-white"
                style={{ transform: `rotate(${minuteDeg - 90}deg)` }}
              />
              <div
                className="absolute left-1/2 top-1/2 h-0.5 w-16 origin-left rounded-full bg-red-500"
                style={{ transform: `rotate(${secondDeg - 90}deg)` }}
              />

              <div className="z-10 h-4 w-4 rounded-full border-2 border-white bg-green-600" />
            </div>

            <h2 className="mt-8 text-4xl font-bold sm:text-6xl">
              {currentTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </h2>

            <p className="mt-3 text-center text-white/80">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "2-digit",
                year: "numeric",
              })}
            </p>

            {/* <div className="mt-5 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
              <Clock size={16} />
              Bangladesh Standard Time
            </div> */}
          </div>

          <div className="flex flex-col justify-center p-8">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-2xl font-bold sm:text-3xl">{monthName}</h3>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="h-10 w-10 cursor-pointer rounded-xl bg-white/10 hover:bg-white/20"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="h-10 w-10 cursor-pointer rounded-xl bg-white/10 hover:bg-white/20"
                >
                  ›
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center sm:gap-3">
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                <div key={day} className="text-xs font-semibold text-white/70">
                  {day}
                </div>
              ))}

              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold sm:h-11 sm:w-11 sm:text-lg ${
                    day === today && isCurrentMonth
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/40"
                      : day
                        ? "text-white hover:bg-white/10"
                        : "text-white/20"
                  }`}
                >
                  {day || ""}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}