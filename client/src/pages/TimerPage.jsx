import { useEffect, useState } from "react";
import axios from "../api/client";
import dayjs from "dayjs";
import TimerCard from "../components/TimerCard";

export default function TimerPage() {
  const [timers, setTimers] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [draggingId, setDraggingId] = useState(null);
  const [openUnitsId, setOpenUnitsId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTimers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/");
      setTimers(res.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimers();
  }, []);

  const createTimer = async () => {
    const startDate = new Date(`${date}T${time}`);

    setIsLoading(true);
    try {
      await axios.post("/", {
        title,
        startDate,
      });

      setTitle("");
      setDate("");
      setTime("");
      await fetchTimers();
    } finally {
      setIsLoading(false);
    }
  };

  const saveOrder = async (nextTimers) => {
    await axios.put("/reorder", {
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
    setIsLoading(true);
    try {
      await axios.delete(`/${id}`);
      await fetchTimers();
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUnitsMenu = (id) => {
    setOpenUnitsId((current) => (current === id ? null : id));
  };

  const updateUnits = async (id, partial) => {
    const existing = timers.find((t) => t._id === id);
    if (!existing) return;

    const payload = {
      showYears:
        typeof partial.showYears === "boolean"
          ? partial.showYears
          : existing.showYears,
      showMonths:
        typeof partial.showMonths === "boolean"
          ? partial.showMonths
          : existing.showMonths,
      showDays:
        typeof partial.showDays === "boolean"
          ? partial.showDays
          : existing.showDays,
      showHours:
        typeof partial.showHours === "boolean"
          ? partial.showHours
          : existing.showHours,
      showMinutes:
        typeof partial.showMinutes === "boolean"
          ? partial.showMinutes
          : existing.showMinutes,
      showSeconds:
        typeof partial.showSeconds === "boolean"
          ? partial.showSeconds
          : existing.showSeconds,
    };

    const res = await axios.patch(`/${id}/units`, payload);

    setTimers((prev) =>
      prev.map((t) => (t._id === id ? { ...t, ...res.data } : t)),
    );
  };

  const activeUnitsTimer = timers.find((t) => t._id === openUnitsId);

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
            disabled={!title || !date || !time || isLoading}
          >
            {isLoading ? "Adding..." : "Add timer"}
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
              {isLoading
                ? "Loading your timers..."
                : "You don't have any timers yet. Create one above to get started."}
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
                      Since {dayjs(t.startDate).format("D MMM YYYY, hh:mm A")}
                    </p>
                  </div>
                  <div className="timer-table-cell value-column">
                    <TimerCard timer={t} />
                  </div>
                  <div className="timer-table-cell actions-column">
                    <button
                      className="ghost-button ghost-button-danger"
                      onClick={() => removeTimer(t._id)}
                      disabled={isLoading}
                    >
                      Delete
                    </button>

                    <button
                      type="button"
                      className="icon-button"
                      aria-label="Timer display options"
                      onClick={() => toggleUnitsMenu(t._id)}
                    >
                      ⋯
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {openUnitsId && activeUnitsTimer && (
        <div className="units-overlay" onClick={() => setOpenUnitsId(null)}>
          <div
            className="units-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="units-modal-title">Units to display</p>

            <label className="unit-toggle-row">
              <input
                type="checkbox"
                checked={!!activeUnitsTimer.showYears}
                onChange={(e) =>
                  updateUnits(activeUnitsTimer._id, {
                    showYears: e.target.checked,
                  })
                }
              />
              <span>Years</span>
            </label>

            <label className="unit-toggle-row">
              <input
                type="checkbox"
                checked={!!activeUnitsTimer.showMonths}
                onChange={(e) =>
                  updateUnits(activeUnitsTimer._id, {
                    showMonths: e.target.checked,
                  })
                }
              />
              <span>Months</span>
            </label>

            <label className="unit-toggle-row">
              <input
                type="checkbox"
                checked={!!activeUnitsTimer.showDays}
                onChange={(e) =>
                  updateUnits(activeUnitsTimer._id, {
                    showDays: e.target.checked,
                  })
                }
              />
              <span>Days</span>
            </label>

            <label className="unit-toggle-row">
              <input
                type="checkbox"
                checked={!!activeUnitsTimer.showHours}
                onChange={(e) =>
                  updateUnits(activeUnitsTimer._id, {
                    showHours: e.target.checked,
                  })
                }
              />
              <span>Hours</span>
            </label>

            <label className="unit-toggle-row">
              <input
                type="checkbox"
                checked={!!activeUnitsTimer.showMinutes}
                onChange={(e) =>
                  updateUnits(activeUnitsTimer._id, {
                    showMinutes: e.target.checked,
                  })
                }
              />
              <span>Minutes</span>
            </label>

            <label className="unit-toggle-row">
              <input
                type="checkbox"
                checked={!!activeUnitsTimer.showSeconds}
                onChange={(e) =>
                  updateUnits(activeUnitsTimer._id, {
                    showSeconds: e.target.checked,
                  })
                }
              />
              <span>Seconds</span>
            </label>

            <button
              type="button"
              className="ghost-button"
              style={{ marginTop: 8, width: "100%", justifyContent: "center" }}
              onClick={() => setOpenUnitsId(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
