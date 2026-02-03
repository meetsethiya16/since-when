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
    setDate("");
    setTime("");
    fetchTimers();
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1 className="app-title">CountUp Timers</h1>
          <p className="app-subtitle">
            Track how long it&apos;s been since the moments that matter.
          </p>
        </div>
      </header>

      <main className="timer-layout">
        <section className="timer-form-card">
          <h2 className="section-title">Create a timer</h2>

          <div className="timer-input-grid">
            <div className="field">
              <label className="field-label" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                className="field-input"
                placeholder="e.g. Since I started this job"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="date">
                Start date
              </label>
              <input
                id="date"
                type="date"
                className="field-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="time">
                Start time
              </label>
              <input
                id="time"
                type="time"
                className="field-input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <button
            className="primary-button"
            onClick={createTimer}
            disabled={!title || !date || !time}
          >
            Add timer
          </button>
        </section>

        <section className="timer-list">
          <div className="timer-list-header">
            <h2 className="section-title">Active timers</h2>
            <span className="timer-count-pill">
              {timers.length} {timers.length === 1 ? "timer" : "timers"}
            </span>
          </div>

          {timers.length === 0 ? (
            <p className="empty-state">
              You don&apos;t have any timers yet. Create one on the left to get
              started.
            </p>
          ) : (
            <div className="timer-grid">
              {timers.map((t) => (
                <TimerCard key={t._id} timer={t} refresh={fetchTimers} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
