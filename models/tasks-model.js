const db = require("../db/dbConfig");

//* Get tasks from user_id
const getUserTasks = async ({ user_id }) => {
  try {
    return await db.any("SELECT * FROM tasks WHERE user_id = $1", [user_id]);
  } catch (error) {
    return error.message;
  }
};

//* Get specific task from task_id
const getTask = async ({ task_id }) => {
  try {
    return await db.oneOrNone("SELECT * FROM tasks WHERE id = $1", [task_id]);
  } catch (error) {
    return error.message;
  }
};

//* Get the task on top of stack
const getTaskOnTop = async ({ user_id }) => {
  try {
    return await db.oneOrNone(
      "SELECT * FROM tasks WHERE next_task_id IS NULL AND user_id = $1",
      [user_id]
    );
  } catch (error) {
    return error.message;
  }
};

//* Get tasks with user_id from specific Date
const getTasksWithDate = async ({ user_id, date }) => {
  try {
    const data = await db.any(
      "SELECT * FROM tasks WHERE user_id = $1 AND date = $2",
      [user_id, date]
    );
    return data;
  } catch (error) {
    return error.message;
  }
};

//* Create new task with user_id
const createTask = async ({ user_id, data, currTopId }) => {
  try {
    return await db.oneOrNone(
      "INSERT INTO tasks(user_id, content, date, previews_task_id, next_task_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [user_id, data.content, data.date, currTopId, null]
    );
  } catch (error) {
    return error.message;
  }
};

//* Edit a specific task with task_id
const editTask = async ({ task_id, data }) => {
  try {
    return await db.oneOrNone(
      "UPDATE tasks SET content = $1, completed = $2, date = $3 WHERE id = $4 RETURNING *",
      [data.content, data.completed, data.date, task_id]
    );
  } catch (error) {
    return error.message;
  }
};

//* Edit the position of a task with task_id
const editTaskPosition = async (task_id, next_task_id, prev_task_id) => {
  try {
    const response = await db.one(
      "UPDATE tasks SET next_task_id = $1, previews_task_id = $2 WHERE id = $3 RETURNING *",
      [next_task_id, prev_task_id, task_id]
    );
    return response;
  } catch (error) {
    return error.message;
  }
};

const editNextTask = async ({ currTask, nextTask }) => {
  try {
    return await db.oneOrNone(
      "UPDATE tasks SET next_task_id = $1 WHERE id = $2 RETURNING *",
      [nextTask, currTask]
    );
  } catch (error) {
    console.log("FDASFDSAf");
    return error.message;
  }
};

const editPrevTask = async ({ currTask, prevTask }) => {
  try {
    return await db.oneOrNone(
      "UPDATE tasks SET previews_task_id = $1 WHERE id = $2 RETURNING *",
      [prevTask, currTask]
    );
  } catch (error) {
    return error.message;
  }
};

//* Delete a specific task with task_id
const deleteTask = async ({ task_id }) => {
  try {
    return await db.oneOrNone("DELETE FROM tasks WHERE id = $1 RETURNING *", [
      task_id,
    ]);
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
  deleteTask,
};
