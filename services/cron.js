const cron = require("node-cron");
const Campaign = require("../models/campaign");
const MailerService = require("./mailer");

// In-memory store for scheduled jobs. Key: campaignId, Value: cron job instance
const scheduledJobs = {};

/**
 * The main task to be executed by the cron job for a campaign.
 * @param {string} campaignId - The ID of the campaign to execute.
 */
const executeCampaign = async (campaignId) => {
  console.log(`Executing campaign: ${campaignId}`);
  try {
    // Use the model directly to avoid circular dependencies with CampaignService
    const campaign = await Campaign.findById(campaignId).populate("emailId");

    if (!campaign || !campaign.emailId) {
      console.error(
        `Campaign or associated email not found for ID: ${campaignId}`
      );
      unscheduleCampaign(campaignId); // Clean up the job
      return;
    }

    const { title, content, attachments } = campaign.emailId;
    const recipients = campaign.emails || [];
    const alreadySentEmails = (campaign.sent || []).map((s) => s.email);
    const toSend = recipients.filter((r) => !alreadySentEmails.includes(r));

    if (toSend.length === 0) {
      console.log(`No new recipients for campaign ${campaignId}.`);
      unscheduleCampaign(campaignId);
      return;
    }

    for (const recipient of toSend) {
      let sentRecord;
      try {
        const mailResponse = await MailerService.sendMail({
          to: recipient,
          subject: title,
          html: content,
          attachments,
        });
        sentRecord = {
          email: recipient,
          success: true,
          messageId: mailResponse.messageId,
          response: mailResponse.response,
					accepted: mailResponse.accepted.includes(recipient),
        };
      } catch (emailError) {
        console.error(
          `Failed to send email to ${recipient} for campaign ${campaignId}:`,
          emailError
        );
        sentRecord = {
          email: recipient,
          success: false,
          error: emailError.message,
        };
      }
      // Add the detailed record to the sent list
      await Campaign.findByIdAndUpdate(campaignId, {
        $push: { sent: sentRecord },
      });
    }

    console.log(
      `Campaign ${campaignId} executed for ${toSend.length} recipients.`
    );
    // Once all are processed, unschedule to prevent re-running
    unscheduleCampaign(campaignId);
  } catch (error) {
    console.error(`Error executing campaign ${campaignId}:`, error);
  }
};

/**
 * Converts a Date object to a cron time string.
 * @param {Date} date - The date to convert.
 * @returns {string} A cron-formatted time string.
 */
const dateToCron = (date) => {
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const dayOfWeek = date.getDay();
  return `${seconds} ${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
};

/**
 * Schedules a cron job for a given campaign.
 * @param {Object} campaign - The campaign object from Mongoose.
 */
const scheduleCampaign = (campaign) => {
  if (!campaign || !campaign.scheduledTime || new Date(campaign.scheduledTime) < new Date()) {
    return;
  }

  // If a job already exists, stop it before creating a new one
  if (scheduledJobs[campaign._id.toString()]) {
    unscheduleCampaign(campaign._id.toString());
  }

  const cronTime = dateToCron(new Date(campaign.scheduledTime));
  if (!cron.validate(cronTime)) {
      console.error(`Invalid cron time for campaign ${campaign._id}. Skipping.`);
      return;
  }

  const job = cron.schedule(cronTime, () => executeCampaign(campaign._id.toString()));
  scheduledJobs[campaign._id.toString()] = job;
  console.log(`Campaign ${campaign._id} scheduled for: ${campaign.scheduledTime}`);
};

/**
 * Stops and removes a scheduled job for a campaign.
 * @param {string} campaignId - The ID of the campaign to unschedule.
 */
const unscheduleCampaign = (campaignId) => {
  const job = scheduledJobs[campaignId];
  if (job) {
    job.stop();
    delete scheduledJobs[campaignId];
    console.log(`Unscheduled campaign: ${campaignId}`);
  }
};

/**
 * Initializes cron jobs for all pending campaigns on application startup.
 */
const initializeJobs = async () => {
  console.log("Initializing cron jobs for pending campaigns...");
  const campaigns = await Campaign.find({ scheduledTime: { $ne: null, $gt: new Date() } });
  campaigns.forEach(scheduleCampaign);
  console.log(`${campaigns.length} pending campaigns scheduled.`);
};

const CronService = {
  scheduleCampaign,
  unscheduleCampaign,
  initializeJobs,
};

module.exports = CronService;