const {
  getAllParentTasks,
  createParentTask,
  getAllParentTasksFromUserId,
  getSpecificDateParentTasksFromUser,
  editParentTask,
  deleteParentTask,
  getTaskWithTaskId,
  getTaskOnTopOfStack,
  editTaskPosition,
} = require("../models/tasks-model");
const date = new Date();

//* ----- Create ------ //
describe("Create functions", () => {
  //FIXME: Fetch instead of create()
  test("Create new task with user ID", async () => {
    const user_id = 1;
    const newTaskData = {
      content: "First task for user_id 1",
      date: null,
    };
    const response = await fetch(`localhost:3014/tasks/${user_id}`, {
      method: "POST",
      body: JSON.stringify(newTaskData),
    });
    expect(response.json()).toStrictEqual({
      id: 1,
      user_id: 1,
      content: "First task for user_id 1",
      progress_state: 1,
      date: null,
      previews_task_id: null,
      next_task_id: null,
    });
  });

  test("Create a second task that will have as preveiws_task_id the first task.", async () => {
    const user_id = 1;
    const newTaskData = {
      content: "Second task for user_id 1",
      date: null,
    };

    const response = await fetch(`localhost:3014/tasks/${user_id}`, {
      method: "POST",
      body: JSON.stringify(newTaskData),
    });
    expect(response.json()).toStrictEqual({
      id: 2,
      user_id: 1,
      content: "Second task for user_id 1",
      progress_state: 1,
      date: null,
      previews_task_id: 1,
      next_task_id: null,
    });
  });

  // test("Create new task with user ID AND date", async () => {
  //   const userId = 1;
  //   const year = date.getFullYear();
  //   const month = date.getMonth();
  //   const day = date.getDate();
  //   const currDate = `${year}-${month}-${day}`;
  //   const newTaskData = {
  //     content: "Second task with date",
  //     date: currDate,
  //   };
  //   const response = await createParentTask(userId, newTaskData, null);
  //   expect(response).toStrictEqual({
  //     id: 2,
  //     user_id: 1,
  //     content: "Second task with date",
  //     progress_state: 1,
  //     date: currDate,
  //     previews_task_id: 1,
  //     next_task_id: null,
  //   });
  // });
});

//* ----- Read ------ //

describe("Read functions", () => {
  test("Get all tasks from user_id", async () => {
    const user_id = 1;
    const response = await fetch(`localhost:3014/tasks/${user_id}`);
    expect(response).toStrictEqual([
      {
        id: 1,
        user_id: 1,
        content: "First task for user_id 1",
        progress_state: 1,
        date: null,
        previews_task_id: null,
        next_task_id: 2,
      },
      {
        id: 2,
        user_id: 1,
        content: "Second task for user_id 1",
        progress_state: 1,
        date: null,
        previews_task_id: 1,
        next_task_id: null,
      },
    ]);
  });

  test("Get specific task with task_id", async () => {
    const task_id = 1;
    const response = await getTaskWithTaskId(task_id);
    expect(response).toStrictEqual([
      {
        id: 1,
        user_id: 1,
        content: "First task for user_id 1",
        progress_state: 1,
        date: null,
        previews_task_id: null,
        next_task_id: 2,
      },
    ]);
  });

  test("Get top of stack from user_id", async () => {
    const user_id = 1;
    const response = await getTaskOnTopOfStack(user_id);
    expect(response).toStrictEqual([
      {
        id: 2,
        user_id: 1,
        content: "Second task for user_id 1",
        progress_state: 1,
        date: null,
        previews_task_id: 1,
        next_task_id: null,
      },
    ]);
  });
});
