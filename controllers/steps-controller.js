const express = require("express");
const controller = express.Router();
const {
  getSteps,
  getStep,
  getStepOnTop,
  createStep,
  editStep,
  editNextStep,
  editPrevStep,
  deleteStep,
} = require("../models/steps-model");

controller.get("/:task_id", async (req, res) => {
  const { task_id } = req.params;
  try {
    await getSteps(task_id).then((data) => {
      data.length
        ? res.status(200).json(data)
        : res.status(200).json({ message: "Child tasks not found" });
    });
  } catch (error) {
    return error.message;
  }
});

controller.post("/:task_id", async (req, res) => {
  const { task_id } = req.params;
  try {
    await getStepOnTop({ task_id: task_id })
      .then(async (currTop) => {
        return await createStep({
          task_id: task_id,
          data: req.body,
          currTopId: currTop.id,
        });
      })
      .then(async (newStep) => {
        await editNextStep({
          currStep: newStep.previews_step_id,
          nextStep: newStep.id,
        });
        return newStep;
      })
      .then((newStep) => {
        newStep
          ? res.status(200).json(newStep)
          : res.status(500).json({ error: "Step not created" });
      });
  } catch (error) {
    return error.message;
  }
});

controller.put("/:step_id", async (req, res) => {
  const { step_id } = req.params;
  try {
    await editStep({
      step_id: step_id,
      data: req.body,
    }).then((data) => {
      data ? res.status(200).json(data) : res.status(404).json({ error: "" });
    });
  } catch (error) {
    return error.message;
  }
});

controller.delete("/:step_id", async (req, res) => {
  const { step_id } = req.params;
  try {
    await getStep({ step_id: step_id })
      .then(async (target) => {
        await editNextStep({
          currStep: target.previews_step_id,
          nextStep: target.next_step_id,
        });
        return target;
      })
      .then(async (target) => {
        await editPrevStep({
          currStep: target.next_step_id,
          prevStep: target.previews_step_id,
        });
        return target;
      })
      .then(async (target) => {
        await deleteStep({ step_id: target.id });
        return target;
      })
      .then((target) => res.status(200).json(target));
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});

module.exports = controller;
