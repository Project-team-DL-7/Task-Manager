const express = require("express");
const ProjectService = require("../../application/ProjectService");
const { validateRequest } = require("zod-express-middleware");
const { z } = require("zod");

const router = express.Router();

/**
 * @swagger
 * /me:
 *  get:
 *    tags:
 *      - Project
 *    description: Fetch logged-in user info
 *    responses:
 *      '200':
 *        description: A successful response
 *      '401':
 *        description: User not logged in
 */
router.get("/", async (req, res, next) => {
  try {
    if (req.user) {
      res.status(200).json(req.user);
    } else {
      res.status(401).send("User not logged in");
    }
  } catch (err) {
    next(err);
  }
});
module.exports = router;
