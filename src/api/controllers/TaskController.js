const express = require("express");
const TaskService = require("../../application/TaskService");
const Task = require("../../domain/Task");
const { validateRequest } = require("zod-express-middleware");
const { z } = require("zod");
const TaskRepository = require("../../infrastructure/storage/TaskRepository");

const router = express.Router();

/**
 * @swagger
 * /task/{id_task}:
 *  get:
 *    tags:
 *      - Task
 *    description: Get task by ID
 *    parameters:
 *    - name: id_task
 *      in: path
 *      required: true
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Task not found
 */
router.get(
  "/:id_task",
  validateRequest({ params: z.object({ id_task: z.coerce.number() }) }),
  async (req, res, next) => {
    try {
      const task = await TaskService.getTaskById(req.params.id_task);
      if (task) {
        res.status(200).json(task);
      } else {
        res.status(404).json({ message: "Task not found" });
      }
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /task:
 *  get:
 *    tags:
 *      - Task
 *    description: Fetch all tasks accessible by user
 *    responses:
 *      '200':
 *        description: A successful response
 *      '401':
 *        description: User not logged in
 */
router.get("/", async (req, res, next) => {
  try {
    if (req?.user?.id) {
      const tasks = await TaskService.getUsersTasks(req.user.id);
      res.status(200).json(tasks);
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    next(err);
  }
});


/**
 * @swagger
 * /task:
 *  post:
 *    tags:
 *      - Task
 *    description: Create a new task
 *    parameters:
 *    - name: task
 *      in: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          id_project:
 *            type: integer
 *          task_name:
 *            type: string
 *          description:
 *            type: string
 *          deadline:
 *            type: integer
 *          status:
 *            type: string
 *    responses:
 *      '201':
 *        description: Task created
 */
router.post(
  "/",
  validateRequest({
    body: z.object({
      id_project: z.number(),
      id_user: z.number(),
      task_name: z.string().min(1),
      description: z.string().min(1),
      deadline: z.number().refine((timestamp) => timestamp >= Date.now(), { message: "Deadline must be in the future" }),
      status: z.string(),
    }),
  }),
  async (req, res, next) => {
    try {
      const result = await TaskService.createTask(req.body);
      if (typeof result?.id_task === "number") {
        return res.status(201).json(result);
      }
      if (result === TaskRepository.ADD_TASK_PARENT_TASK_DOES_NOT_EXIST) {
        return res.status(400).json({ message: "Parent task does not exist" })
      }
      if (result === TaskRepository.ADD_TASK_USER_DOES_NOT_EXIST) {
        return res.status(400).json({ message: "User does not exist" })
      }
      if (result === TaskRepository.ADD_TASK_PROJECT_DOES_NOT_EXIST) {
        return res.status(400).json({ message: "Project does not exist" })
      }
      throw new Error(result)
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /task/{id_task}:
 *  delete:
 *    tags:
 *      - Task
 *    description: Delete task by ID
 *    parameters:
 *    - name: id_task
 *      in: path
 *      required: true
 *    responses:
 *      '200':
 *        description: Task deleted
 *      '404':
 *        description: Task not found
 */
router.delete(
  "/:id_task",
  validateRequest({ params: z.object({ id_task: z.coerce.number() }) }),
  async (req, res, next) => {
    try {
      const result = await TaskService.deleteTaskById(req.params.id_task);
      if (result) {
        res.status(200).json({ message: "Task deleted" });
      } else {
        res.status(404).json({ message: "Task not found" });
      }
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /task:
 *  put:
 *    tags:
 *      - Task
 *    description: Update a task
 *    parameters:
 *    - name: task
 *      in: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          id_task:
 *            type: integer
 *          id_project:
 *            type: integer
 *          task_name:
 *            type: string
 *          description:
 *            type: string
 *          deadline:
 *            type: integer
 *          status:
 *            type: string
 *    responses:
 *      '200':
 *        description: Task updated
 *      '404':
 *        description: Task not found
 */
router.put(
  "/",
  validateRequest({
    body: z.object({
      id_project: z.number(),
      task_name: z.string(),
      description: z.string(),
      deadline: z.number(),
      status: z.string(),
    }),
  }),
  async (req, res, next) => {
    try {
      const updatedTask = await TaskService.updateTask(req.body);
      if (updatedTask) {
        res.status(200).json(updatedTask);
      } else {
        res.status(404).json({ message: "Task not found" });
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
