import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function TimerCard({ timer }) {
  const [diff, setDiff] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
  });

  const calc = () => {
    const now = dayjs();
    const start = dayjs(timer.startDate);

    const totalMs = now.diff(start);
    const totalSeconds = Math.floor(totalMs / 1000);

    let remaining = totalSeconds;

    const secondsInYear = 365 * 24 * 60 * 60;
    const secondsInMonth = 30 * 24 * 60 * 60;
    const secondsInDay = 24 * 60 * 60;
    const secondsInHour = 60 * 60;
    const secondsInMinute = 60;

    const years = Math.floor(remaining / secondsInYear);
    remaining %= secondsInYear;

    const months = Math.floor(remaining / secondsInMonth);
    remaining %= secondsInMonth;

    const days = Math.floor(remaining / secondsInDay);
    remaining %= secondsInDay;

    const hours = Math.floor(remaining / secondsInHour);
    remaining %= secondsInHour;

    const minutes = Math.floor(remaining / secondsInMinute);
    const seconds = remaining % secondsInMinute;

    setDiff({
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      totalSeconds,
    });
  };

  useEffect(() => {
    calc();
    const i = setInterval(calc, 100);
    return () => clearInterval(i);
  }, []);

  const { years, months, days, hours, minutes, seconds, totalSeconds } = diff;

  const showMinutes = totalSeconds >= 60;
  const showHours = totalSeconds >= 60 * 60;
  const showDays = totalSeconds >= 24 * 60 * 60;
  const showMonths = totalSeconds >= 30 * 24 * 60 * 60;
  const showYears = totalSeconds >= 365 * 24 * 60 * 60;

  return (
    <div className="timer-value">
      {showYears && (
        <span className="timer-unit">
          <span className="timer-number">{years}</span>
          <span className="timer-label">years</span>
        </span>
      )}

      {showMonths && (
        <span className="timer-unit">
          <span className="timer-number">{months}</span>
          <span className="timer-label">months</span>
        </span>
      )}

      {showDays && (
        <span className="timer-unit">
          <span className="timer-number">{days}</span>
          <span className="timer-label">days</span>
        </span>
      )}

      {showHours && (
        <span className="timer-unit">
          <span className="timer-number">{hours}</span>
          <span className="timer-label">hours</span>
        </span>
      )}

      {showMinutes && (
        <span className="timer-unit">
          <span className="timer-number">{minutes}</span>
          <span className="timer-label">minutes</span>
        </span>
      )}

      <span className="timer-unit">
        <span className="timer-number">{seconds}</span>
        <span className="timer-label">seconds</span>
      </span>
    </div>
  );
}
