/**
 * @fileoverview Campaign routes for creating, reading, updating, and deleting campaigns.
 * @module routes/campaigns
 */

const express = require("express");
const router = express.Router();
const CampaignService = require("../services/campaign");
const { respond } = require("../utils");

/**
 * @route   GET /campaigns
 * @desc    Get all campaigns
 * @access  Public
 */
router.get("/", async (req, res, next) => {
  try {
    const response = await CampaignService.getAll();
    return respond(res, response);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /campaigns/:id
 * @desc    Get a single campaign by ID
 * @access  Public
 * @param   {string} req.params.id - The ID of the campaign.
 */
router.get("/:id", async (req, res, next) => {
  try {
    const response = await CampaignService.getById({ campaignId: req.params.id });
    return respond(res, response);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /campaigns
 * @desc    Create a new campaign
 * @access  Public
 */
router.post("/", async (req, res, next) => {
  try {
    const response = await CampaignService.create(req.body);
    respond(res, response);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /campaigns/:id
 * @desc    Edit an existing campaign
 * @access  Public
 * @param   {string} req.params.id - The ID of the campaign to update.
 */
router.put("/:id", async (req, res, next) => {
  try {
    const response = await CampaignService.update({ ...req.body, campaignId: req.params.id });
    respond(res, response);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /campaigns/:id
 * @desc    Delete a campaign
 * @access  Public
 * @param   {string} req.params.id - The ID of the campaign to delete.
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const response = await CampaignService.remove({ campaignId: req.params.id });
    respond(res, response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
