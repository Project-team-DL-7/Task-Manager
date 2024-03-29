const express = require("express");
const TeamService = require("../../application/TeamService");
const Team = require("../../domain/Team");
const { validateRequest } = require("zod-express-middleware");
const { z } = require("zod");
const TeamRepository = require("../../infrastructure/storage/TeamRepository");
const authenticationMiddleware = require("../../middleware/authenticationMiddleware");
const UserService = require("../../application/UserService");
const AuthorizationPipeline = require("../../authorization/AuthorizationPipeline");
const isUserPartOfTeam = require("../../authorization/strategies/isUserPartOfTeam");

const router = express.Router();

router.use(authenticationMiddleware)

/**
 * @swagger
 * /team/{id_team}:
 *  get:
 *    tags:
 *      - Team
 *    description: Get team by ID
 *    parameters:
 *    - name: id_team
 *      in: path
 *      required: true
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Team not found
 */
router.get(
  "/:id_team",
  validateRequest({ params: z.object({ id_team: z.coerce.number() }) }),
  async (req, res, next) => {
    const errors = await AuthorizationPipeline(isUserPartOfTeam(req.user.id, req.params.id_team))
    if (errors.length) return res.status(403).json(errors)

    try {
      const team = await TeamService.getTeamById(req.params.id_team);
      if (team) {
        res.status(200).json(team);
      } else {
        res.status(404).json({ message: "Team not found" });
      }
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /team:
 *  get:
 *    tags:
 *      - Team
 *    description: Fetch all teams accessible by user
 *    responses:
 *      '200':
 *        description: A successful response
 *      '401':
 *        description: User not logged in
 */
router.get("/", async (req, res, next) => {
  try {
    if (req?.user?.id) {
      const teams = await TeamService.getUsersTeams(req.user.id);
      res.status(200).json(teams);
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /team:
 *  post:
 *    tags:
 *      - Team
 *    description: Create a new team
 *    parameters:
 *    - name: team
 *      in: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          team_name:
 *            type: string
 *          description:
 *            type: string
 *    responses:
 *      '201':
 *        description: Team created
 */
router.post(
  "/",
  validateRequest({
    body: z.object({
      team_name: z.string().min(1),
      description: z.string().min(1),
    }),
  }),

  async (req, res, next) => {
    try {
      const createdTeam = await TeamService.createTeam(req.body, req.user.id);
      res.status(201).json(createdTeam);
    } catch (err) {
      res.status(400).json({ message: "Team with this name already exists" });
    }
  }
);

/**
 * @swagger
 * /team/{id_team}:
 *  delete:
 *    tags:
 *      - Team
 *    description: Delete team by ID
 *    parameters:
 *    - name: id_team
 *      in: path
 *      required: true
 *    responses:
 *      '200':
 *        description: Team deleted
 *      '404':
 *        description: Team not found
 */
router.delete(
  "/:id_team",
  validateRequest({ params: z.object({ id_team: z.coerce.number() }) }),
  async (req, res, next) => {
    const errors = await AuthorizationPipeline(isUserPartOfTeam(req.user.id, req.params.id_team))
    if (errors.length) return res.status(403).json(errors)

    try {
      const result = await TeamService.deleteTeamById(req.params.id_team);
      if (result) {
        res.status(200).json({ message: "Team deleted" });
      } else {
        res.status(404).json({ message: "Team not found" });
      }
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /team:
 *  put:
 *    tags:
 *      - Team
 *    description: Update a team
 *    parameters:
 *    - name: team
 *      in: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          id_team:
 *            type: integer
 *          team_name:
 *            type: string
 *          description:
 *            type: string
 *    responses:
 *      '200':
 *        description: Team updated
 *      '400':
 *        description: Conflicting name with other team
 *      '404':
 *        description: Team not found
 */
router.put(
  "/",
  validateRequest({
    body: z.object({
      id_team: z.number(),
      team_name: z.string(),
      description: z.string(),
    }),
  }),
  async (req, res, next) => {
    const errors = await AuthorizationPipeline(isUserPartOfTeam(req.user.id, req.body.id_team))
    if (errors.length) return res.status(403).json(errors)

    try {
      const updatedTeam = await TeamService.updateTeam(req.body);
      if (updatedTeam) {
        if (updatedTeam.team_name === req.body.team_name)
          res.status(200).json(updatedTeam);
        else
          res.status(400).json({ message: "Conflicting name with other team" });
      } else {
        res.status(404).json({ message: "Team not found" });
      }
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:id_team/invite/:id_user",
  validateRequest({ params: z.object({ id_team: z.coerce.number(), id_user: z.coerce.number() }) }),
  async (req, res, next) => {
    const errors = await AuthorizationPipeline(isUserPartOfTeam(req.user.id, req.params.id_team))
    if (errors.length) return res.status(403).json(errors)

    try {
      const result = await TeamService.inviteUser(req.params.id_team, req.params.id_user);
      if (typeof result?.userId === "number") {
        return res.status(201).json({ message: "User invited successfully" })
      }
      if (result === TeamRepository.INVITE_USER_INVITATION_ALREADY_EXISTS) {
        return res.status(400).json({ message: "User already invited" })
      }
      if (result === TeamRepository.INVITE_USER_TEAM_DOES_NOT_EXIST) {
        return res.status(400).json({ message: "Team does not exist" })
      }
      if (result === TeamRepository.INVITE_USER_USER_DOES_NOT_EXIST) {
        return res.status(400).json({ message: "User does not exist" })
      }
      throw new Error(result)
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:id_team/remove/:id_user",
  validateRequest({ params: z.object({ id_team: z.coerce.number(), id_user: z.coerce.number() }) }),
  async (req, res, next) => {
    const errors = await AuthorizationPipeline(isUserPartOfTeam(req.user.id, req.params.id_team))
    if (errors.length) return res.status(403).json(errors)

    try {
      const result = await TeamService.removeUser(req.params.id_team, req.params.id_user);
      if(result) {
        return res.status(200).json({message: "User removed successfully"})
      }
      else {
        return res.status(400).json({message: "User not part of this team"})
      }
    } catch (err) {
      next(err);
    }
  }
);


module.exports = router;
