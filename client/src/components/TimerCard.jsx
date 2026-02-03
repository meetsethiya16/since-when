import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const API = "http://localhost:5000/api/timers";

export default function TimerCard({ timer, refresh }) {
  const [diff, setDiff] = useState({});

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
    <div style={{ marginTop: 20 }}>
      <h3>{timer.title}</h3>

      <div>
        {timer.showDays && `${diff.days}d `}
        {timer.showHours && `${diff.hours}h `}
        {timer.showSeconds && `${diff.seconds}s`}
      </div>

      <button onClick={remove}>Delete</button>
    </div>
  );
}
