import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import TimerCard from "../components/TimerCard";

const API = "http://localhost:5000/api/timers";

export default function TimerPage() {
  const [timers, setTimers] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [draggingId, setDraggingId] = useState(null);

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

  const saveOrder = async (nextTimers) => {
    await axios.put(`${API}/reorder`, {
      order: nextTimers.map((t) => t._id),
    });
  };

  const handleDragStart = (id) => {
    setDraggingId(id);
  };

  const handleDragOver = (id, event) => {
    event.preventDefault();
    if (!draggingId || draggingId === id) return;

    setTimers((prev) => {
      const currentIndex = prev.findIndex((t) => t._id === draggingId);
      const targetIndex = prev.findIndex((t) => t._id === id);

      if (currentIndex === -1 || targetIndex === -1) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(currentIndex, 1);
      updated.splice(targetIndex, 0, moved);
      return updated;
    });
  };

  const handleDrop = async () => {
    if (!draggingId) return;
    setDraggingId(null);
    await saveOrder(timers);
  };

  const removeTimer = async (id) => {
    await axios.delete(`${API}/${id}`);
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
              You don&apos;t have any timers yet. Create one above to get
              started.
            </p>
          ) : (
            <div className="timer-table">
              <div className="timer-table-header-row">
                <div className="timer-table-header-cell drag-column" />
                <div className="timer-table-header-cell title-column">
                  Timer
                </div>
                <div className="timer-table-header-cell value-column">
                  Elapsed
                </div>
                <div className="timer-table-header-cell actions-column" />
              </div>
              {timers.map((t) => (
                <div
                  key={t._id}
                  className={`timer-table-row${
                    draggingId === t._id ? " is-dragging" : ""
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(t._id)}
                  onDragOver={(event) => handleDragOver(t._id, event)}
                  onDrop={handleDrop}
                  onDragEnd={handleDrop}
                >
                  <div className="timer-table-cell drag-column">
                    <span className="drag-handle" aria-label="Reorder timer">
                      ⋮⋮
                    </span>
                  </div>
                  <div className="timer-table-cell title-column">
                    <h3 className="timer-title">{t.title}</h3>
                    <p className="timer-since">
                      Since {dayjs(t.startDate).format("D MMM YYYY, HH:mm")}
                    </p>
                  </div>
                  <div className="timer-table-cell value-column">
                    <TimerCard timer={t} />
                  </div>
                  <div className="timer-table-cell actions-column">
                    <button
                      className="ghost-button ghost-button-danger"
                      onClick={() => removeTimer(t._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
