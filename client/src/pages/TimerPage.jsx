import { useEffect, useState } from "react";
import axios from "axios";
import TimerCard from "../components/TimerCard";

const API = "http://localhost:5000/api/timers";

export default function TimerPage() {
  const [timers, setTimers] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const fetchTimers = async () => {
    const res = await axios.get(API);
    setTimers(res.data);
  };

  useEffect(() => {
    fetchTimers();
  }, []);

  const createTimer = async () => {
    const startDate = new Date(`${date}T${time}`);

    await axios.post(API, {
      title,
      startDate,
    });

    setTitle("");
    fetchTimers();
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>CountUp Timers</h1>

      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <input type="date" onChange={(e) => setDate(e.target.value)} />
      <input type="time" onChange={(e) => setTime(e.target.value)} />
      <button onClick={createTimer}>Add</button>

      {timers.map((t) => (
        <TimerCard key={t._id} timer={t} refresh={fetchTimers} />
      ))}
    </div>
  );
}
