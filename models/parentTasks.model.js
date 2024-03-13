const db = require("../db/dbConfig");

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
const createParentTask = async (data, user_id) => {
  try {
    const response = await db.one(
      "INSERT INTO parentTasks(user_id,details_id,content,progress_state,is_staged,date) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        user_id,
        data.details_id,
        data.content,
        data.progress_state,
        data.is_staged,
        data.date,
      ]
    );
    return response;
  } catch (error) {
    return error.message;
  }
};

//* Edit a specific task with task_id
const editParentTask = async (task_id, newData) => {
  try {
    const response = await db.one(
      "UPDATE parentTasks SET content = $1, progress_state = $2, is_staged = $3, date = $4 WHERE id = $5 RETURNING *",
      [
        newData.content,
        newData.progress_state,
        newData.is_staged,
        newData.date,
        task_id,
      ]
    );
    return response;
  } catch (error) {
    return error.message;
  }
};

//* Delete a specific task with task_id
const deleteParentTask = async (task_id) => {
  try {
    const response = await db.any(
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
};
