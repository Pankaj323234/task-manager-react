const Task = require("./models/Task");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));



// GET all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// ADD task
app.post("/tasks", async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.json(newTask);
});

// DELETE task
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});


app.put("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = task.status === "Completed" ? "Pending" : "Completed";  
    await task.save();

    res.json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


app.put("/tasks/edit/:id", async (req, res) => {
  try {
    const { text, status, priority, dueDate } = req.body;

const task = await Task.findByIdAndUpdate(
  req.params.id,
  { text, status, priority, dueDate },
  { new: true }
);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


app.delete("/tasks", async (req, res) => {
  try {
    await Task.deleteMany({});
    res.json({ message: "All tasks deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});