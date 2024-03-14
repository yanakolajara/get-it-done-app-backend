const express = require("express");
const controller = express.Router();
const { getChildTasksFromTaskId } = require("../models/childTasks.model");

controller.get("/:task_id", async (req, res) => {
  try {
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

module.exports = controller;
