const express = require("express");
const controller = express.Router();
const {
  getAllParentTasks,
  createParentTask,
  getAllParentTasksFromUserId,
  getSpecificDateParentTasksFromUser,
  editParentTask,
  deleteParentTask,
  getTaskWithTaskId,
  getTaskOnTopOfStack,
  editTaskPosition,
  editNextTask,
  editPrevTask,
} = require("../models/tasks-model");

controller.get("/", async (req, res) => {
  try {
    const data = await getAllParentTasks();
    if (data.length) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: "Parent tasks not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});

//* Get tasks with user_id
controller.get("/:user_id", async (req, res) => {
  try {
    const data = await getAllParentTasksFromUserId(req.params.user_id);
    if (data.length) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: "Parent tasks not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});

//* Get tasks with user_id from specific Date

controller.get("/:user_id/:date", async (req, res) => {
  try {
    const data = await getSpecificDateParentTasksFromUser(
      req.params.user_id,
      req.params.date
    );
    if (data.length) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: "There are no tasks on this date" });
    }
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});

//* Create new task with user_id

controller.post("/:user_id", async (req, res) => {
  try {
    const currTop = await getTaskOnTopOfStack(1);
    const newTop = await createParentTask(
      req.params.user_id,
      req.body,
      currTop.id || null
    );
    currTop.id && (await editNextTask(currTop.id, newTop.id));
    if (newTop.id) {
      res.status(201).json(newTop);
    } else {
      res.status(500).json({ error: "Task not created" });
    }
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});

//* Edit a specific task with task_id

controller.put("/:task_id", async (req, res) => {
  try {
    const newParentTask = await editParentTask(req.params.task_id, req.body);
    if (!newParentTask.length) {
      res.status(200).json(newParentTask);
    } else {
      res.status(404).json({ error: "Task ID was not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});

//* Delete a specific task with task_id

controller.delete("/:task_id", async (req, res) => {
  try {
    let target = await getTaskWithTaskId(req.params.task_id);
    await editNextTask(target.previews_task_id, target.next_task_id);
    await editPrevTask(target.next_task_id, target.previews_task_id);
    await deleteParentTask(target.id);
    res.status(200).json(target);
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});

module.exports = controller;
