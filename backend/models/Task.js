const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },

  status: {
    type: String,
    default: "Pending"
  },

  priority: {
    type: String,
    default: "Low"
  },

  dueDate: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Task", taskSchema);