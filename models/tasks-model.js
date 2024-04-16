const db = require("../db/dbConfig");

//* Get tasks from user_id
const getUserTasks = async (user_id) => {
  try {
    return await db.any("SELECT * FROM parentTasks WHERE user_id = $1", [
      user_id,
    ]);
  } catch (error) {
    return error.message;
  }
};

//* Get specific task from task_id
const getTask = async (task_id) => {
  try {
    return await db.one("SELECT * FROM parentTasks WHERE id = $1", [task_id]);
  } catch (error) {
    return error.message;
  }
};

//* Get the task on top of stack
const getTaskOnTop = async (user_id) => {
  try {
    return await db.oneOrNone(
      "SELECT * FROM parentTasks WHERE next_task_id IS NULL AND user_id = $1",
      [user_id]
    );
  } catch (error) {
    return error.message;
  }
};

//* Get tasks with user_id from specific Date
const getTasksWithDate = async (user_id, date) => {
  try {
    const data = await db.any(
      "SELECT * FROM parentTasks WHERE user_id = $1 AND date = $2",
      [user_id, date]
    );
    return data;
  } catch (error) {
    return error.message;
  }
};

//* Create new task with user_id
const createTask = async (user_id, data, past_task_id) => {
  try {
    return await db.oneOrNone(
      "INSERT INTO parentTasks(user_id, content, progress_state, date, previews_task_id, next_task_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [user_id, data.content, 1, data.date, past_task_id, null]
    );
  } catch (error) {
    return error.message;
  }
};

//* Edit a specific task with task_id
const editTask = async (task_id, newData) => {
  try {
    return await db.oneOrNone(
      "UPDATE parentTasks SET content = $1, progress_state = $2, date = $3 WHERE id = $4 RETURNING *",
      [
        newData.content,
        newData.progress_state || 1,
        newData.date || "null",
        task_id,
      ]
    );
  } catch (error) {
    return error.message;
  }
};

//* Edit the position of a task with task_id
const editTaskPosition = async (task_id, next_task_id, prev_task_id) => {
  try {
    const response = await db.one(
      "UPDATE parentTasks SET next_task_id = $1, previews_task_id = $2 WHERE id = $3 RETURNING *",
      [next_task_id, prev_task_id, task_id]
    );
    return response;
  } catch (error) {
    return error.message;
  }
};

const editNextTask = async (task_id, next_task_id) => {
  try {
    const response = await db.oneOrNone(
      "UPDATE parentTasks SET next_task_id = $1 WHERE id = $2 RETURNING *",
      [next_task_id, task_id]
    );
    return response;
  } catch (error) {
    console.log("FDASFDSAf");
    return error.message;
  }
};

const editPrevTask = async (task_id, previews_task_id) => {
  try {
    const response = await db.one(
      "UPDATE parentTasks SET previews_task_id = $1 WHERE id = $2 RETURNING *",
      [previews_task_id, task_id]
    );
    return response;
  } catch (error) {
    return error.message;
  }
};

//* Delete a specific task with task_id
const deleteParentTask = async (task_id) => {
  try {
    const response = await db.one(
      "DELETE FROM parentTasks WHERE id = $1 RETURNING *",
      [task_id]
    );
    return response;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getUserTasks,
  getTasksWithDate,
  getTask,
  getTaskOnTop,
  editTask,
  editNextTask,
  editPrevTask,
  editTaskPosition,
  createTask,
  deleteParentTask,
};
