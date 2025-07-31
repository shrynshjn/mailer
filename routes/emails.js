/**
 * @fileoverview Email routes for creating, reading, updating, and deleting email templates.
 * @module routes/emails
 */

const express = require("express");
const router = express.Router();
const EmailService = require("../services/email");
const { respond } = require("../utils");

/**
 * @route   GET /emails
 * @desc    Get all email templates
 * @access  Public
 */
router.get("/", async (req, res, next) => {
  try {
    const response = await EmailService.getAll();
    return respond(res, response);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /emails/:id
 * @desc    Get a single email template by ID
 * @access  Public
 * @param   {string} req.params.id - The ID of the email template.
 */
router.get("/:id", async (req, res, next) => {
  try {
    const response = await EmailService.getById({ emailId: req.params.id });
    return respond(res, response);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /emails
 * @desc    Create a new email template
 * @access  Public
 * @param   {object} req.body - The email template data.
 * @param   {string} req.body.name - The name of the template.
 * @param   {string} req.body.title - The title/subject of the email.
 * @param   {string} req.body.content - The HTML content of the email.
 */
router.post("/", async (req, res, next) => {
  try {
    const response = await EmailService.create(req.body);
    respond(res, response);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /emails/:id
 * @desc    Edit an existing email template
 * @access  Public
 * @param   {string} req.params.id - The ID of the email template to update.
 */
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await EmailService.update({ ...req.body, emailId: id });
    respond(res, response);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /emails/:id
 * @desc    Delete an email template
 * @access  Public
 * @param   {string} req.params.id - The ID of the email template to delete.
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const response = await EmailService.remove({ emailId: req.params.id });
    respond(res, response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
