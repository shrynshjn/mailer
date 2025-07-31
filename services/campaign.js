const Campaign = require("../models/campaign");
const CronService = require("./cron");

/**
 * Gets all campaigns.
 * @returns {Promise<Object>} An object containing the success status, data, and a message.
 */
const getAll = async () => {
  const campaigns = await Campaign.find({}).populate('emailId');
  return { success: true, data: { campaigns }, message: "Campaigns list" };
};

/**
 * Gets a single campaign by its ID.
 * @param {Object} payload - The payload.
 * @param {string} payload.campaignId - The ID of the campaign to retrieve.
 * @returns {Promise<Object>} An object containing the success status, data (if found), and a message.
 */
const getById = async (payload) => {
  const campaign = await Campaign.findById(payload.campaignId).populate('emailId');
  if (!campaign) {
    return { success: false, message: "Campaign not found" };
  }
  return { success: true, data: { campaign }, message: "Campaign found" };
};

/**
 * Creates a new campaign.
 * @param {Object} payload - The payload.
 * @param {string} payload.name - The name of the campaign.
 * @param {string} payload.emailId - The ID of the email template to use.
 * @param {Date} [payload.scheduledTime] - The scheduled time for the campaign.
 * @param {Array<string>} [payload.emails=[]] - The list of recipient emails.
 * @returns {Promise<Object>} An object containing the success status, created data, and a message.
 */
const create = async (payload) => {

  const { name, emailId, scheduledTime, emails } = payload;
  const campaignData = {
    name,
    emailId,
    scheduledTime,
    emails,
  };
  const campaign = await Campaign.create(campaignData);
  CronService.scheduleCampaign(campaign);
  return {
    success: true,
    data: { campaign },
    message: "Campaign created successfully",
  };
};

/**
 * Updates an existing campaign.
 * @param {Object} payload - The payload.
 * @param {string} payload.campaignId - The ID of the campaign to update.
 * @returns {Promise<Object>} An object containing the success status, updated data, and a message.
 */
const update = async (payload) => {
  const { campaignId, ...updateData } = payload;
  const campaign = await Campaign.findByIdAndUpdate(campaignId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!campaign) {
    return { success: false, message: "Campaign not found" };
  }

  CronService.scheduleCampaign(campaign);

  return {
    success: true,
    data: { campaign },
    message: "Campaign updated successfully",
  };
};

/**
 * Deletes a campaign by its ID.
 * @param {Object} payload - The payload.
 * @param {string} payload.campaignId - The ID of the campaign to delete.
 * @returns {Promise<Object>} An object containing the success status, and a message.
 */
const remove = async (payload) => {
  const campaign = await Campaign.findByIdAndDelete(payload.campaignId);
  if (!campaign) {
    return { success: false, message: "Campaign not found" };
  }
  CronService.unscheduleCampaign(payload.campaignId);
  return {
    success: true,
    data: { campaign },
    message: "Campaign deleted successfully",
  };
};

const CampaignService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
module.exports = CampaignService;
