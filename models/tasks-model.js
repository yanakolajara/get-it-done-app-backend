const db = require("../db/dbConfig");

//* Get all tasks
const getAllParentTasks = async () => {
  try {
    const data = await db.any("SELECT * FROM parentTasks");
    return data;
  } catch (error) {
    return error.message;
  }
};

//* Get tasks with user_id
const getAllParentTasksFromUserId = async (user_id) => {
  try {
    const data = await db.any("SELECT * FROM parentTasks WHERE user_id = $1", [
      user_id,
    ]);
    return data;
  } catch (error) {
    return error.message;
  }
};

//* Get specific task with task_id
const getTaskWithTaskId = async (task_id) => {
  try {
    const data = await db.any("SELECT * FROM parentTasks WHERE id = $1", [
      task_id,
    ]);
    return data;
  } catch (error) {
    return error.message;
  }
};

//* Get the task on top of stack
const getTaskOnTopOfStack = async (user_id) => {
  try {
    const data = await db.any(
      "SELECT * FROM parentTasks WHERE next_task_id IS NULL AND user_id = $1",
      [user_id]
    );

    return data;
  } catch (error) {
    return error.message;
  }
};

//* Get tasks with user_id from specific Date
const getSpecificDateParentTasksFromUser = async (user_id, date) => {
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
const createParentTask = async (user_id, data, past_task_id) => {
  try {
    const response = await db.one(
      "INSERT INTO parentTasks(user_id, content, progress_state, date, previews_task_id, next_task_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [user_id, data.content, 1, data.date, past_task_id, null]
    );
    return response;
  } catch (error) {
    return error.message;
  }
};

//* Edit a specific task with task_id
const editParentTask = async (task_id, newData) => {
  console.log("editParentTaskProps:", task_id, newData);
  try {
    console.log([
      newData.content,
      newData.progress_state || 1,
      newData.date || null,
      task_id,
    ]);
    const response = await db.one(
      "UPDATE parentTasks SET content = $1, progress_state = $2, date = $3 WHERE id = $4 RETURNING *",
      [
        newData.content,
        newData.progress_state || 1,
        newData.date || "null",
        task_id,
      ]
    );
    return response;
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
  getAllParentTasks,
  createParentTask,
  getAllParentTasksFromUserId,
  getSpecificDateParentTasksFromUser,
  editParentTask,
  deleteParentTask,
  getTaskWithTaskId,
  getTaskOnTopOfStack,
  editTaskPosition,
};
