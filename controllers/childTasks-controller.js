const express = require("express");
const controller = express.Router();
const {
  getChildTasksFromTaskId,
  getAllChildTasks,
  getTaskOnTopOfQueue,
  createChildTask,
  editChildTaskPosition,
  deleteChildTask,
  editChildTaskCompletionStatus,
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
    const data = await getChildTasksFromTaskId(req.params.task_id);
    if (data.length) {
      res.status(200).json(data);
    } else {
      res.status(200).json({ message: "Child tasks not found" });
    }
  } catch (error) {
    return error.message;
  }
});

controller.post("/:task_id", async (req, res) => {
  try {
    const past_task = await getTaskOnTopOfQueue(req.params.task_id);
    const newChildTask = await createChildTask(
      req.params.task_id,
      req.body,
      past_task.length > 0 ? past_task[0].id : null
    );
    if (!!past_task.length) {
      const editedTask = await editChildTaskPosition(
        past_task[0].id,
        newChildTask.id,
        past_task[0].previews_task_id
      );
    }

    if (newChildTask) {
      res.status(200).json(newChildTask);
    } else {
      res.status(500).json({ error: "Task not created" });
    }
  } catch (error) {
    return error.message;
  }
});

controller.put("/completionStatus/:task_id", async (req, res) => {
  try {
    const editedTask = await editChildTaskCompletionStatus(
      req.params.task_id,
      req.body.isCompleted
    );
    if (editedTask) {
      res.status(200).json(editedTask);
    } else {
      res.status(404).json({ error: "" });
    }
  } catch (error) {
    return error.message;
  }
});

controller.delete("/:task_id", async (req, res) => {
  try {
    const deletedTask = await deleteChildTask(req.params.task_id);
    if (deletedTask) {
      req.status(200).json(deletedTask);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    return error.message;
  }
});

module.exports = controller;
