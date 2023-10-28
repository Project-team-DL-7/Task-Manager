const express = require('express');
const TeamService = require('../../application/TeamService');
const Team = require('../../domain/Team');

const router = express.Router();

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
router.get('/:id_team', (req, res) => {
  const team = TeamService.getTeamById(req.params.id_team);
  if (team) {
    res.status(200).json(team);
  } else {
    res.status(404).json({ message: "Team not found" });
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
router.post('/', (req, res) => {
  const createdTeam = TeamService.createTeam(req.body);
  res.status(201).json(createdTeam);
});

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
router.delete('/:id_team', (req, res) => {
  const result = TeamService.deleteTeamById(req.params.id_team);
  if (result) {
    res.status(200).json({ message: "Team deleted" });
  } else {
    res.status(404).json({ message: "Team not found" });
  }
});

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
 *      '404':
 *        description: Team not found
 */
router.put('/', (req, res) => {
  const updatedTeam = TeamService.updateTeam(req.body);
  if (updatedTeam) {
    res.status(200).json(updatedTeam);
  } else {
    res.status(404).json({ message: "Team not found" });
  }
});

module.exports = router;
