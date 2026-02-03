const router = require("express").Router();
const Timer = require("../models/Timer");

// GET all
router.get("/", async (req, res) => {
  const timers = await Timer.find().sort({ createdAt: -1 });
  res.json(timers);
});

// CREATE
router.post("/", async (req, res) => {
  const timer = await Timer.create(req.body);
  res.json(timer);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Timer.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
