const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

const tasksController = require("./controllers/tasks-controller");
const childTasksController = require("./controllers/steps-controller");

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/tasks", tasksController);
app.use("/steps", childTasksController);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
