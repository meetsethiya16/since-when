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

    // If the start date is in the future
    if (start.isAfter(now)) {
      setDiff({
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
      });

      return;
    }

    let cursor = start;

    // Complete calendar years
    const years = now.diff(cursor, "year");
    cursor = cursor.add(years, "year");

    // Complete calendar months
    const months = now.diff(cursor, "month");
    cursor = cursor.add(months, "month");

    // Remaining days
    const days = now.diff(cursor, "day");
    cursor = cursor.add(days, "day");

    // Remaining hours
    const hours = now.diff(cursor, "hour");
    cursor = cursor.add(hours, "hour");

    // Remaining minutes
    const minutes = now.diff(cursor, "minute");
    cursor = cursor.add(minutes, "minute");

    // Remaining seconds
    const seconds = now.diff(cursor, "second");

    // Total elapsed seconds
    const totalSeconds = now.diff(start, "second");

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

    const interval = setInterval(calc, 1000);

    return () => clearInterval(interval);
  }, [timer.startDate]);

  const {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
  } = diff;

  /*
   * Show a unit only when:
   * 1. The user has enabled that unit
   * 2. There is actually something meaningful to display
   *
   * Once a larger unit exists, smaller units are also allowed.
   */

  const showYears = timer.showYears && years > 0;

  const showMonths =
    timer.showMonths && (years > 0 || months > 0);

  const showDays =
    timer.showDays &&
    (years > 0 || months > 0 || days > 0);

  const showHours =
    timer.showHours &&
    (years > 0 ||
      months > 0 ||
      days > 0 ||
      hours > 0);

  const showMinutes =
    timer.showMinutes &&
    (years > 0 ||
      months > 0 ||
      days > 0 ||
      hours > 0 ||
      minutes > 0);

  // Seconds are shown by default unless explicitly disabled
  const showSeconds = timer.showSeconds !== false;

  return (
    <div className="timer-value">
      {showYears && (
        <span className="timer-unit">
          <span className="timer-number">{years}</span>
          <span className="timer-label">
            {years === 1 ? "year" : "years"}
          </span>
        </span>
      )}

      {showMonths && (
        <span className="timer-unit">
          <span className="timer-number">{months}</span>
          <span className="timer-label">
            {months === 1 ? "month" : "months"}
          </span>
        </span>
      )}

      {showDays && (
        <span className="timer-unit">
          <span className="timer-number">{days}</span>
          <span className="timer-label">
            {days === 1 ? "day" : "days"}
          </span>
        </span>
      )}

      {showHours && (
        <span className="timer-unit">
          <span className="timer-number">{hours}</span>
          <span className="timer-label">
            {hours === 1 ? "hour" : "hours"}
          </span>
        </span>
      )}

      {showMinutes && (
        <span className="timer-unit">
          <span className="timer-number">{minutes}</span>
          <span className="timer-label">
            {minutes === 1 ? "minute" : "minutes"}
          </span>
        </span>
      )}

      {showSeconds && (
        <span className="timer-unit">
          <span className="timer-number">{seconds}</span>
          <span className="timer-label">
            {seconds === 1 ? "second" : "seconds"}
          </span>
        </span>
      )}
    </div>
  );
}
