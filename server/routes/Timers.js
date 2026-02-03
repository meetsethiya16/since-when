const router = require("express").Router();
const Timer = require("../models/Timer");

// GET all
router.get("/", async (req, res) => {
  const timers = await Timer.find().sort({ order: 1, createdAt: 1 });
  res.json(timers);
});

// CREATE
router.post("/", async (req, res) => {
  const count = await Timer.countDocuments();
  const timer = await Timer.create({ ...req.body, order: count });
  res.json(timer);
});

// REORDER
router.put("/reorder", async (req, res) => {
  const { order } = req.body;

  if (!Array.isArray(order)) {
    return res.status(400).json({ error: "order must be an array of timer IDs" });
  }

  await Promise.all(
    order.map((id, index) =>
      Timer.findByIdAndUpdate(id, { order: index }).exec(),
    ),
  );

  res.json({ success: true });
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Timer.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
