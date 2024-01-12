const express = require("express");
const ProjectService = require("../../application/ProjectService");
const Project = require("../../domain/Project");
const { validateRequest } = require("zod-express-middleware");
const { z } = require("zod");

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
router.get(
  "/:id_project",
  validateRequest({ params: z.object({ id_project: z.coerce.number() }) }),
  async (req, res, next) => {
    try {
      const project = await ProjectService.getProjectById(
        req.params.id_project
      );
      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404).json({ message: "Project not found" });
      }
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /project:
 *  get:
 *    tags:
 *      - Project
 *    description: Fetch all projects accessible by user
 *    responses:
 *      '200':
 *        description: A successful response
 *      '401':
 *        description: User not logged in
 */
router.get("/", async (req, res, next) => {
  try {
    if (req?.user?.id) {
      const projects = await ProjectService.getUsersProjects(req.user.id);
      res.status(200).json(projects);
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    next(err);
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
router.post(
  "/",
  validateRequest({
    body: z.object({
      name: z.string(),
      description: z.string(),
      id_team: z.number(),
    }),
  }),
  async (req, res, next) => {
    try {
      const createdProject = await ProjectService.createProject(req.body);
      res.status(201).json(createdProject);
    } catch (err) {
      next(err);
    }
  }
);

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
router.delete(
  "/:id_project",
  validateRequest({ params: z.object({ id_project: z.coerce.number() }) }),
  async (req, res, next) => {
    try {
      const result = await ProjectService.deleteProjectById(
        req.params.id_project
      );
      if (result) {
        res.status(200).json({ message: "Project deleted" });
      } else {
        res.status(404).json({ message: "Project not found" });
      }
    } catch (err) {
      next(err);
    }
  }
);

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
router.put(
  "/:id_project",
  validateRequest({
    params: z.object({ id_project: z.coerce.number() }),
    body: z.object({ 
      description: z.string().optional(),
      name: z.string().optional()
    }),
  }),
  async (req, res, next) => {
    const projectToUpdate = {
      id_project: req.params.id_project,
      description: req.body.description,
      name: req.body.name
    };

    try {
      const updatedProject = await ProjectService.updateProject(
        projectToUpdate
      );
      if (updatedProject) {
        res.status(200).json(updatedProject);
      } else {
        res.status(404).json({ message: "Project not found" });
      }
    } catch (err) {
      res.status(400).json({ message: "Invalid project data" }); // Handle validation errors
      next(err);
    }
  }
);

module.exports = router;
