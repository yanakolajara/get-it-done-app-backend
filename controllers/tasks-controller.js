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
    return error.message;
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
    return error.message;
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
    return error.message;
  }
});

//* Create new task with user_id

controller.post("/:user_id", async (req, res) => {
  try {
    const past_task = await getTaskOnTopOfStack(1);
    const newParentTask = await createParentTask(
      req.body,
      req.params.user_id,
      past_task[0] ? past_task[0].id : null
    );
    if (past_task[0]) {
      const past_edited_task = await editTaskPosition(
        past_task[0].id,
        newParentTask.id,
        past_task[0].previews_task_id
      );
    }
    if (newParentTask) {
      res.status(201).json(newParentTask);
    } else {
      res.status(500).json({ error: "Task not created" });
    }
  } catch (error) {
    return error.message;
  }
});

//* Edit a specific task with task_id

controller.put("/:task_id", async (req, res) => {
  try {
    const newParentTask = await editParentTask(req.params.task_id, req.body);
    if (newParentTask) {
      res.status(200).json(newParentTask);
    } else {
      res.status(404).json({ error: "Task ID was not found" });
    }
  } catch (error) {
    return error.message;
  }
});

//* Delete a specific task with task_id

controller.delete("/:task_id", async (req, res) => {
  try {
    const taskToDelete = await getTaskWithTaskId(req.params.task_id);
    const deletedParentTask = await deleteParentTask(req.params.task_id);
    const prevTask = await editTaskPosition(
      taskToDelete[0].previews_task_id,
      taskToDelete[0].next_task_id,
      undefined
    );
    const nextTask = await editTaskPosition(
      taskToDelete[0].next_task_id,
      undefined,
      taskToDelete[0].previews_task_id
    );
    if (deletedParentTask.length) {
      res.status(200).json(deletedParentTask);
    } else {
      res.status(404).json({ error: "Task ID was not found" });
    }
  } catch (error) {
    return error.message;
  }
});

module.exports = controller;
