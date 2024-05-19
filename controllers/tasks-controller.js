const express = require("express");
const controller = express.Router();
const {
  createTask,
  getUserTasks,
  getTask,
  editTask,
  deleteTask,
  getTaskOnTop,
  editNextTask,
  editPrevTask,
} = require("../models/tasks-model");
const { getDayStr } = require("../utils/dateUtils");

//* Get tasks from user_id
controller.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { date } = req.query;
  try {
    await getUserTasks({
      user_id,
      date,
    }).then((data) => {
      data.length
        ? res.status(200).json(data)
        : res.status(404).json({ error: "Tasks not found" });
    });
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});

//* Create new task with user_id
controller.post("/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    await getTaskOnTop({ user_id })
      .then(async (currTop) => {
        return await createTask({
          user_id,
          data: {
            ...req.body,
            date: req.body.date ?? getDayStr(),
          },
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
      task
        ? res.status(200).json(task)
        : res.status(404).json({ error: "Task ID was not found" });
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
