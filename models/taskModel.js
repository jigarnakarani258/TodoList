const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide your task title."],
  },
  description: {
    type: String,
    required: [true, "Please provide your task description."],
  },
  dueDate: {
    type: Date,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false
  },
  priority: {
    type: String,
    enum: {
      values: ["high", "medium", "low"],
      message: `priority of task only one of this value:- 'high' ,'medium', 'low'.`
    },
  },
  createdByUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});

const Tasks = mongoose.model("Task", taskSchema);

module.exports = { Tasks };
