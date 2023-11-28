const express = require("express");
const UserService = require("../../application/UserService");
const User = require("../../domain/User");
const { validateRequest } = require("zod-express-middleware");
const { z } = require("zod");

const router = express.Router();

/**
 * @swagger
 * /user/{id_user}:
 *  get:
 *    tags:
 *      - User
 *    description: Get user by id_user
 *    parameters:
 *    - name: id_user
 *      in: path
 *      required: true
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: User not found
 */
router.get(
  "/:id_user",
  validateRequest({ params: z.object({ id_user: z.coerce.number() }) }),
  (req, res) => {
    const user = UserService.getUserById(req.params.id_user);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }
);

/**
 * @swagger
 * /user:
 *  post:
 *    tags:
 *      - User
 *    description: Create a new user
 *    parameters:
 *    - name: user
 *      in: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *          username:
 *            type: string
 *          password:
 *            type: string
 *          registrationDate:
 *            type: integer
 *    responses:
 *      '201':
 *        description: User created
 */
router.post(
  "/",
  validateRequest({
    body: z.object({
      email: z.string(),
      username: z.string(),
      password: z.string(),
      registrationDate: z.number(),
    }),
  }),
  (req, res) => {
    const createdUser = UserService.createUser(req.body);
    res.status(201).json(createdUser);
  }
);

/**
 * @swagger
 * /user/{id_user}:
 *  delete:
 *    tags:
 *      - User
 *    description: Delete user by id_user
 *    parameters:
 *    - name: id_user
 *      in: path
 *      required: true
 *    responses:
 *      '200':
 *        description: User deleted
 *      '404':
 *        description: User not found
 */
router.delete(
  "/:id_user",
  validateRequest({ params: z.object({ id_user: z.coerce.number() }) }),
  (req, res) => {
    const result = UserService.deleteUserById(req.params.id_user);
    if (result) {
      res.status(200).json({ message: "User deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }
);

/**
 * @swagger
 * /user:
 *  put:
 *    tags:
 *      - User
 *    description: Update a user
 *    parameters:
 *    - name: user
 *      in: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          id_user:
 *            type: integer
 *          email:
 *            type: string
 *          username:
 *            type: string
 *          password:
 *            type: string
 *          registrationDate:
 *            type: integer
 *    responses:
 *      '200':
 *        description: User updated
 *      '404':
 *        description: User not found
 */
router.put(
  "/",
  validateRequest({
    body: z.object({
      id_user: z.number(),
      email: z.string(),
      username: z.string(),
      password: z.string(),
      registrationDate: z.number(),
    }),
  }),
  (req, res) => {
    const updatedUser = UserService.updateUser(req.body);
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }
);

module.exports = router;
