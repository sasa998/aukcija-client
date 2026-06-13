"use client";

import { useEffect, useState } from "react";

function getTimeLeft(endsAt: string) {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return null;

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

interface CountdownTimerProps {
  endsAt: string;
}

export function CountdownTimer({ endsAt }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(endsAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(endsAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  if (!timeLeft) {
    return <span className="text-[#666666]">Ended</span>;
  }

  if (timeLeft.days > 0) {
    return (
      <span className="tabular-nums text-[#191919]">
        {timeLeft.days}d {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m
      </span>
    );
  }

  const isUrgent = timeLeft.hours === 0 && timeLeft.minutes < 10;

  return (
    <span
      className={`tabular-nums font-medium ${isUrgent ? "text-red-600" : "text-[#191919]"}`}
    >
      {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
    </span>
  );
}
