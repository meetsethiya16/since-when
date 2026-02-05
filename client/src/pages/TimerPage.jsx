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

  // ✅ FETCH
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

  // ✅ CREATE
  const createTimer = async () => {
    const startDate = new Date(`${date}T${time}`);

    setIsLoading(true);
    try {
      await axios.post("/", { title, startDate });

      setTitle("");
      setDate("");
      setTime("");

      await fetchTimers();
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ REORDER
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

  // ✅ DELETE
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

  // ✅ UPDATE UNITS
  const updateUnits = async (id, partial) => {
    const existing = timers.find((t) => t._id === id);
    if (!existing) return;

    const payload = {
      showYears: partial.showYears ?? existing.showYears,
      showMonths: partial.showMonths ?? existing.showMonths,
      showDays: partial.showDays ?? existing.showDays,
      showHours: partial.showHours ?? existing.showHours,
      showMinutes: partial.showMinutes ?? existing.showMinutes,
      showSeconds: partial.showSeconds ?? existing.showSeconds,
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
        <h1 className="app-title">CountUp Timers</h1>
      </header>

      <main>
        <button
          onClick={createTimer}
          disabled={!title || !date || !time || isLoading}
        >
          {isLoading ? "Adding..." : "Add timer"}
        </button>

        {timers.length === 0 ? (
          <p>
            {isLoading
              ? "Starting server… please wait a few seconds"
              : "No timers yet"}
          </p>
        ) : (
          timers.map((t) => (
            <TimerCard
              key={t._id}
              timer={t}
              onDelete={() => removeTimer(t._id)}
            />
          ))
        )}
      </main>
    </div>
  );
}
