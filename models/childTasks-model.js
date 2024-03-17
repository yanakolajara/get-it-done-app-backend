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
    console.log("data: ", data);
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

const createChildTask = async (data, parentTask_id, past_task_id) => {
  try {
    const response = await db.one(
      "INSERT INTO childTasks(parentTask_id, content, completed,  physical_energy, emotional_energy, previews_task_id, next_task_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        parentTask_id,
        data.content,
        false,
        data.physical_energy,
        data.emotional_energy,
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
    let query;
    let params;
    if (next_task_id === undefined) {
      query =
        "UPDATE childTasks SET previews_task_id = $1 WHERE id = $2 RETURNING *";
      params = [prev_task_id, task_id];
    } else if (prev_task_id === undefined) {
      query =
        "UPDATE childTasks SET next_task_id = $1 WHERE id = $2 RETURNING *";
      params = [next_task_id, task_id];
    } else {
      query =
        "UPDATE childTasks SET next_task_id = $1, previews_task_id = $2 WHERE id = $3 RETURNING *";
      params = [next_task_id, prev_task_id, task_id];
    }
    const response = await db.one(query, params);
    return response;
  } catch (error) {
    return error.message;
  }
};

//* Delete a specific task with task_id

module.exports = {
  getAllChildTasks,
  getChildTasksFromTaskId,
  getTaskOnTopOfQueue,
  createChildTask,
  editChildTaskPosition,
};
