const express = require('express');
const UserService = require('../../application/UserService');
const User = require('../../domain/User');

const router = express.Router();

/**
 * @swagger
 * /user/{id}:
 *  get:
 *    description: Get user by ID
 *    parameters:
 *    - name: id
 *      in: path
 *      required: true
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/:id', (req, res) => {
  const user = UserService.getUserById(req.params.id);
  res.status(200).json(user);
});

module.exports = router;
