const db = require("../db/dbConfig");

const getSteps = async ({ task_id }) => {
  try {
    return await db.any("SELECT * FROM steps WHERE task_id = $1", [task_id]);
  } catch (error) {
    return error.message;
  }
};

const getStep = async ({ step_id }) => {
  try {
    return await db.oneOrNone("SELECT * FROM steps WHERE id = $1", [step_id]);
  } catch (error) {
    return error.message;
  }
};

const getStepOnTop = async ({ task_id }) => {
  try {
    return await db.oneOrNone(
      "SELECT * FROM steps WHERE next_task_id IS NULL AND task_id = $1",
      [task_id]
    );
  } catch (error) {
    return error.message;
  }
};

//* Create new task with task_id
const createStep = async ({ task_id, data, currTopId }) => {
  try {
    return await db.oneOrNone(
      "INSERT INTO steps(task_id, content, completed, physical_energy, emotional_energy , previews_step_id, next_step_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        task_id,
        data.content,
        false,
        data.physical_energy,
        data.emotional_energy,
        currTopId,
        null,
      ]
    );
  } catch (error) {
    return error.message;
  }
};

//* Edit a specific task with task_id

// const editChildTaskPosition = async (task_id, next_task_id, prev_task_id) => {
//   try {
//     const response = await db.one(
//       "UPDATE steps SET next_task_id = $1, previews_task_id = $2 WHERE id = $3 RETURNING *",
//       [next_task_id, prev_task_id, task_id]
//     );
//     return response;
//   } catch (error) {
//     return error.message;
//   }
// };

const editStep = async ({ step_id, data }) => {
  try {
    return await db.oneOrNone(
      "UPDATE steps SET content = $1, completed = $2, physical_energy = $3, emotional_energy = $4 WHERE id = $5 RETURNING *",
      [
        data.content,
        data.completed,
        data.physical_energy,
        data.emotional_energy,
        step_id,
      ]
    );
  } catch (error) {
    return error.message;
  }
};

const editNextStep = async ({ currStep, nextStep }) => {
  try {
    return await db.oneOrNone(
      "UPDATE steps SET next_step_id = $1 WHERE id = $2 RETURNING *",
      [nextStep, currStep]
    );
  } catch (error) {
    return error.message;
  }
};

const editPrevStep = async ({ currStep, prevStep }) => {
  try {
    return await db.oneOrNone(
      "UPDATE steps SET previews_step_id = $1 WHERE id = $2 RETURNING *",
      [prevStep, currStep]
    );
  } catch (error) {
    return error.message;
  }
};

//* Delete a specific task with task_id
const deleteStep = async ({ step_id }) => {
  try {
    return await db.one("DELETE FROM steps WHERE id = $1 RETURNING *", [
      step_id,
    ]);
    return response;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  getSteps,
  getStep,
  getStepOnTop,
  createStep,
  editStep,
  editNextStep,
  editPrevStep,
  deleteStep,
};
