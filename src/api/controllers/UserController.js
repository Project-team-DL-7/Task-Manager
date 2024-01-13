const express = require("express");
const UserService = require("../../application/UserService");
const User = require("../../domain/User");
const { validateRequest } = require("zod-express-middleware");
const { z } = require("zod");
const authenticationMiddleware = require("../../middleware/authenticationMiddleware");
const AuthorizationPipeline = require("../../authorization/AuthorizationPipeline");
const isUserPartOfTeam = require("../../authorization/strategies/isUserPartOfTeam");

const router = express.Router();

router.use(authenticationMiddleware)



/**
 * @swagger
 * /user/team/{id_team}:
 *  get:
 *    tags:
 *      - User
 *    description: Get users by id_team
 *    parameters:
 *    - name: id_team
 *      in: path
 *      required: true
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get(
  "/team/:id_team",
  validateRequest({ params: z.object({ id_team: z.coerce.number() }) }),
  async (req, res, next) => {
    const errors = await AuthorizationPipeline(isUserPartOfTeam(req.user.id, req.params.id_team))
    if (errors.length) return res.status(403).json(errors)

    try {
      const users = await UserService.getUsersByTeamId(req.params.id_team);
      res.status(200).json(users)
    } catch (err) {
      next(err);
    }
  }
);


// These endpoints probably won't be used
// For user creation there is auth/signup endpoint
// PUT / DELETE are nice to have

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
// router.delete(
//   "/:id_user",
//   validateRequest({ params: z.object({ id_user: z.coerce.number() }) }),
//   async (req, res, next) => {
//     try {
//       const result = await UserService.deleteUserById(req.params.id_user);
//       if (result) {
//         res.status(200).json({ message: "User deleted" });
//       } else {
//         res.status(404).json({ message: "User not found" });
//       }
//     } catch (err) {
//       next(err);
//     }
//   }
// );

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
// router.put(
//   "/",
//   validateRequest({
//     body: z.object({
//       id_user: z.number(),
//       email: z.string(),
//       username: z.string(),
//       password: z.string(),
//       registrationDate: z.number(),
//     }),
//   }),
//   async (req, res, next) => {
//     try {
//       const updatedUser = await UserService.updateUser(req.body);
//       if (updatedUser) {
//         res.status(200).json(updatedUser);
//       } else {
//         res.status(404).json({ message: "User not found" });
//       }
//     } catch (err) {
//       next(err);
//     }
//   }
// );
//
module.exports = router;
