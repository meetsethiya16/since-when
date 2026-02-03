import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const API = "http://localhost:5000/api/timers";

export default function TimerCard({ timer, refresh }) {
  const [diff, setDiff] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calc = () => {
    const now = dayjs();
    const start = dayjs(timer.startDate);

    const total = now.diff(start);

    const seconds = Math.floor(total / 1000);

    setDiff({
      days: Math.floor(seconds / 86400),
      hours: Math.floor((seconds % 86400) / 3600),
      minutes: Math.floor((seconds % 3600) / 60),
      seconds: seconds % 60,
    });
  };

  useEffect(() => {
    calc();
    const i = setInterval(calc, 100);
    return () => clearInterval(i);
  }, []);

  const remove = async () => {
    await axios.delete(`${API}/${timer._id}`);
    refresh();
  };

  return (
    <div className="timer-card">
      <div className="timer-card-header">
        <h3 className="timer-title">{timer.title}</h3>
        <button className="ghost-button ghost-button-danger" onClick={remove}>
          Delete
        </button>
      </div>

      <p className="timer-since">
        Since{" "}
        {dayjs(timer.startDate).format("D MMM YYYY, HH:mm")}
      </p>

      <div className="timer-value">
        {timer.showDays && (
          <span className="timer-unit">
            <span className="timer-number">{diff.days}</span>
            <span className="timer-label">days</span>
          </span>
        )}

        {timer.showHours && (
          <span className="timer-unit">
            <span className="timer-number">{diff.hours}</span>
            <span className="timer-label">hours</span>
          </span>
        )}

        {timer.showSeconds && (
          <span className="timer-unit">
            <span className="timer-number">{diff.seconds}</span>
            <span className="timer-label">seconds</span>
          </span>
        )}
      </div>
    </div>
  );
}
