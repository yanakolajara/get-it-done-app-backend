const express = require("express");
const controller = express.Router();
const {
  createTask,
  getUserTasks,
  getTasksWithDate,
  getTask,
  editTask,
  deleteTask,
  getTaskOnTop,
  editNextTask,
  editPrevTask,
} = require("../models/tasks-model");

//* Get tasks from user_id
controller.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    await getUserTasks({ user_id: user_id }).then((data) => {
      if (data.length) res.status(200).json(data);
      else res.status(404).json({ error: "Parent tasks not found" });
    });
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});

//* Get tasks from user_id from specific Date
controller.get("/:user_id/:date", async (req, res) => {
  const { user_id, date } = req.params;
  try {
    await getTasksWithDate({
      user_id: user_id,
      date: date,
    }).then((data) => {
      if (data.length) res.status(200).json(data);
      else res.status(404).json({ error: "There are no tasks on this date" });
    });
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});

//* Create new task with user_id
controller.post("/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    await getTaskOnTop({ user_id: user_id })
      .then(async (currTop) => {
        return await createTask({
          user_id: user_id,
          data: req.body,
          currTopId: currTop.id,
        });
      })
      .then(async (newTask) => {
        await editNextTask({
          currTask: newTask.previews_task_id,
          nextTask: newTask.id,
        });
        return newTask;
      })
      .then((newTask) => {
        res.status(201).json(newTask);
      });
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});

//* Edit a specific task with task_id
controller.put("/:task_id", async (req, res) => {
  const { task_id } = req.params;
  try {
    await editTask({
      task_id: task_id,
      data: req.body,
    }).then((task) => {
      if (task) res.status(200).json(task);
      else res.status(404).json({ error: "Task ID was not found" });
    });
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});

//* Delete a specific task with task_id
controller.delete("/:task_id", async (req, res) => {
  const { task_id } = req.params;
  try {
    await getTask({ task_id: task_id })
      .then(async (target) => {
        await editNextTask({
          currTask: target.previews_task_id,
          nextTask: target.next_task_id,
        });
        return target;
      })
      .then(async (target) => {
        await editPrevTask({
          currTask: target.next_task_id,
          prevTask: target.previews_task_id,
        });
        return target;
      })
      .then(async (target) => {
        await deleteTask({ task_id: target.id });
        return target;
      })
      .then((target) => res.status(200).json(target));
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});

module.exports = controller;
