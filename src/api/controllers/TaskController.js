const express = require('express');
const TaskService = require('../../application/TaskService');
const Task = require('../../domain/Task');

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
router.get('/:id_task', (req, res) => {
  const task = TaskService.getTaskById(req.params.id_task);
  if (task) {
    res.status(200).json(task);
  } else {
    res.status(404).json({ message: "Task not found" });
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
 *    responses:
 *      '201':
 *        description: Task created
 */
router.post('/', (req, res) => {
  const createdTask = TaskService.createTask(req.body);
  res.status(201).json(createdTask);
});

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
router.delete('/:id_task', (req, res) => {
  const result = TaskService.deleteTaskById(req.params.id_task);
  if (result) {
    res.status(200).json({ message: "Task deleted" });
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

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
 *    responses:
 *      '200':
 *        description: Task updated
 *      '404':
 *        description: Task not found
 */
router.put('/', (req, res) => {
  const updatedTask = TaskService.updateTask(req.body);
  if (updatedTask) {
    res.status(200).json(updatedTask);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

module.exports = router;
