const express = require('express');
const ProjectService = require('../../application/ProjectService');
const Project = require('../../domain/Project');

const router = express.Router();

/**
 * @swagger
 * /project/{id_project}:
 *  get:
 *    tags:
 *      - Project
 *    description: Get project by ID
 *    parameters:
 *    - name: id_project
 *      in: path
 *      required: true
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Project not found
 */
router.get('/:id_project', (req, res) => {
  const project = ProjectService.getProjectById(req.params.id_project);
  if (project) {
    res.status(200).json(project);
  } else {
    res.status(404).json({ message: "Project not found" });
  }
});

/**
 * @swagger
 * /project:
 *  post:
 *    tags:
 *      - Project
 *    description: Create a new project
 *    parameters:
 *    - name: project
 *      in: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          description:
 *            type: string
 *    responses:
 *      '201':
 *        description: Project created
 */
router.post('/', (req, res) => {
  const createdProject = ProjectService.createProject(req.body);
  res.status(201).json(createdProject);
});

/**
 * @swagger
 * /project/{id_project}:
 *  delete:
 *    tags:
 *      - Project
 *    description: Delete project by ID
 *    parameters:
 *    - name: id_project
 *      in: path
 *      required: true
 *    responses:
 *      '200':
 *        description: Project deleted
 *      '404':
 *        description: Project not found
 */
router.delete('/:id_project', (req, res) => {
  const result = ProjectService.deleteProjectById(req.params.id_project);
  if (result) {
    res.status(200).json({ message: "Project deleted" });
  } else {
    res.status(404).json({ message: "Project not found" });
  }
});

/**
 * @swagger
 * /project:
 *  put:
 *    tags:
 *      - Project
 *    description: Update a project
 *    parameters:
 *    - name: project
 *      in: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          id_project:
 *            type: integer
 *          description:
 *            type: string
 *    responses:
 *      '200':
 *        description: Project updated
 *      '404':
 *        description: Project not found
 */
router.put('/', (req, res) => {
  const updatedProject = ProjectService.updateProject(req.body);
  if (updatedProject) {
    res.status(200).json(updatedProject);
  } else {
    res.status(404).json({ message: "Project not found" });
  }
});

module.exports = router;
