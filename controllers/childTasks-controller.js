const express = require("express");
const controller = express.Router();
const {
  getChildTasksFromTaskId,
  getAllChildTasks,
  getTaskOnTopOfQueue,
  createChildTask,
  editChildTaskPosition,
} = require("../models/childTasks-model");

controller.get("/", async (req, res) => {
  try {
    const data = await getAllChildTasks();
    res.status(200).json(data);
  } catch (error) {
    return error.message;
  }
});

controller.get("/:task_id", async (req, res) => {
  try {
    console.log("here");
    const data = await getChildTasksFromTaskId(req.params.task_id);
    if (data.length) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: "Parent tasks not found" });
    }
  } catch (error) {
    return error.message;
  }
});

controller.post("/:task_id", async (req, res) => {
  try {
    //* Task stack will be added from top to bottom, so that head is the bottom
    const past_task = await getTaskOnTopOfQueue(req.params.task_id);
    const newChildTask = await createChildTask(
      req.body,
      req.params.task_id,
      past_task[0] || null
    );
    if (past_task[0]) {
      await editChildTaskPosition(
        past_task[0].id,
        newChildTask.id,
        past_task[0].previews_task_id
      );
    }
    if (newChildTask) {
      res.status(201).json(newChildTask);
    } else {
      res.status(500).json({ error: "Task not created" });
    }
  } catch (error) {
    return error.message;
  }
});

module.exports = controller;
