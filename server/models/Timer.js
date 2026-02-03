const mongoose = require("mongoose");

const TimerSchema = new mongoose.Schema(
  {
    title: String,
    startDate: Date,
    order: { type: Number, default: 0 },

    showYears: { type: Boolean, default: true },
    showMonths: { type: Boolean, default: true },
    showDays: { type: Boolean, default: true },
    showHours: { type: Boolean, default: true },
    showMinutes: { type: Boolean, default: true },
    showSeconds: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Timer", TimerSchema);
