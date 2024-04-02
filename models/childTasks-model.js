const db = require("../db/dbConfig");

//* Get childTasks with task_id

const getAllChildTasks = async () => {
  try {
    const data = await db.any("SELECT * FROM childTasks");
    return data;
  } catch (error) {
    return error.message;
  }
};
const getChildTasksFromTaskId = async (task_id) => {
  try {
    const data = await db.any(
      "SELECT * FROM childTasks WHERE parentTask_id = $1",
      [task_id]
    );
    return data;
  } catch (error) {
    return error.message;
  }
};

const getTaskOnTopOfQueue = async (task_id) => {
  try {
    const data = await db.any(
      "SELECT * FROM childTasks WHERE next_task_id IS NULL AND parentTask_id = $1",
      [task_id]
    );
    return data;
  } catch (error) {
    return error.message;
  }
};

//* Create new task with task_id

const createChildTask = async (parentTask_id, data, past_task_id) => {
  try {
    const response = await db.one(
      "INSERT INTO childTasks(parentTask_id, content, completed, physical_energy, emotional_energy , previews_task_id, next_task_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        parentTask_id,
        data.content,
        false,
        data.physical_energy || 0,
        data.emotional_energy || 0,
        past_task_id,
        null,
      ]
    );
    return response;
  } catch (error) {
    return error.message;
  }
};

//* Edit a specific task with task_id

const editChildTaskPosition = async (task_id, next_task_id, prev_task_id) => {
  try {
    const response = await db.one(
      "UPDATE childTasks SET next_task_id = $1, previews_task_id = $2 WHERE id = $3 RETURNING *",
      [next_task_id, prev_task_id, task_id]
    );
    return response;
  } catch (error) {
    return error.message;
  }
};

const editChildTaskCompletionStatus = async (task_id, isCompleted) => {
  try {
    const response = await db.one(
      "UPDATE childTasks SET completed = $1 WHERE id = $2 RETURNING *",
      [isCompleted, task_id]
    );
    return response;
  } catch (error) {
    return error.message;
  }
};

//* Delete a specific task with task_id

const deleteChildTask = async (task_id) => {
  try {
    const response = await db.one(
      "DELETE FROM childTasks WHERE id = $1 RETURNING *",
      [task_id]
    );
    return response;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllChildTasks,
  getChildTasksFromTaskId,
  getTaskOnTopOfQueue,
  createChildTask,
  editChildTaskPosition,
  deleteChildTask,
  editChildTaskCompletionStatus,
};
