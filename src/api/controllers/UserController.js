const express = require('express');
const UserService = require('../../application/UserService');
const User = require('../../domain/User');

const router = express.Router();

/**
 * @swagger
 * /user/{id}:
 *  get:
 *    tags:
 *      - User
 *    description: Get user by ID
 *    parameters:
 *    - name: id
 *      in: path
 *      required: true
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: User not found
 */
router.get('/:id', (req, res) => {
  const user = UserService.getUserById(req.params.id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

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
router.post('/', (req, res) => {
  const newUser = new User(null, req.body.email, req.body.username, req.body.password, req.body.registrationDate);
  const createdUser = UserService.createUser(newUser);
  res.status(201).json(createdUser);
});

/**
 * @swagger
 * /user/{id}:
 *  delete:
 *    tags:
 *      - User
 *    description: Delete user by ID
 *    parameters:
 *    - name: id
 *      in: path
 *      required: true
 *    responses:
 *      '200':
 *        description: User deleted
 *      '404':
 *        description: User not found
 */
router.delete('/:id', (req, res) => {
  const result = UserService.deleteUserById(req.params.id);
  if (result) {
    res.status(200).json({ message: "User deleted" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

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
 *          id:
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
router.put('/', (req, res) => {
  const userToUpdate = new User(req.body.id, req.body.email, req.body.username, req.body.password, req.body.registrationDate);
  const updatedUser = UserService.updateUser(userToUpdate);
  if (updatedUser) {
    res.status(200).json(updatedUser);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

module.exports = router;
