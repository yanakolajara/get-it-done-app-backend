const db = require("../db/dbConfig");

//* Get childTasks with task_id
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

//* Create new task with user_id

//* Edit a specific task with task_id

//* Delete a specific task with task_id

module.exports = {
  getChildTasksFromTaskId,
};
