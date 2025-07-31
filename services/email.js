const Email = require("../models/email");

/**
 * Gets all email templates.
 * @returns {Promise<Object>} An object containing the success status, data, and a message.
 */
const getAll = async () => {
  const emails = await Email.find({});
  return { success: true, data: { emails }, message: "Emails list" };
};

/**
 * Gets a single email template by its ID.
 * @param {Object} payload - The payload.
 * @param {string} payload.emailId - The ID of the email to retrieve.
 * @returns {Promise<Object>} An object containing the success status, data (if found), and a message.
 */
const getById = async (payload) => {
  const email = await Email.findById(payload.emailId);
  if (!email) {
    return { success: false, message: "Email not found" };
  }
  return { success: true, data: { email }, message: "Email found" };
};

/**
 * Creates a new email template.
 * @param {Object} payload - The payload.
 * @param {string} payload.name - The name of the email template.
 * @param {string} payload.title - The title/subject of the email.
 * @param {string} payload.content - The HTML content of the email.
 * @param {Array} [payload.attachments=[]] - An array of attachments.
 * @returns {Promise<Object>} An object containing the success status, created data, and a message.
 */
const create = async (payload) => {
  const { name, content, title, attachments } = payload;
  const emailData = {
    name,
    content,
    title,
    attachments,
  };
  const email = await Email.create(emailData);
  return {
    success: true,
    data: { email },
    message: "Email template created successfully",
  };
};

/**
 * Updates an existing email template.
 * @param {Object} payload - The payload.
 * @param {string} payload.emailId - The ID of the email to update.
 * @param {string} [payload.name] - The new name of the email template.
 * @param {string} [payload.title] - The new title/subject of the email.
 * @param {string} [payload.content] - The new HTML content of the email.
 * @param {Array} [payload.attachments] - The new array of attachments.
 * @returns {Promise<Object>} An object containing the success status, updated data, and a message.
 */
const update = async (payload) => {
  const { emailId, name, content, title, attachments } = payload;
  const email = await Email.findByIdAndUpdate(
    emailId,
    { name, content, title, attachments },
    { new: true, omitUndefined: true, runValidators: true }
  );

  if (!email) {
    return { success: false, message: "Email not found" };
  }

  return {
    success: true,
    data: { email },
    message: "Email template updated successfully",
  };
};

/**
 * Deletes an email template by its ID.
 * @param {Object} payload - The payload.
 * @param {string} payload.emailId - The ID of the email to delete.
 * @returns {Promise<Object>} An object containing the success status, deleted data, and a message.
 */
const remove = async (payload) => {
  const { emailId } = payload;
  const email = await Email.findByIdAndDelete(emailId);
  if (!email) {
    return { success: false, message: "Email not found" };
  }
  return {
    success: true,
    data: { email },
    message: "Email template deleted successfully",
  };
};

/**
 * @namespace EmailService
 */
const EmailService = {
  getAll,
  getById,
  create,
  update,
  remove,
};

module.exports = EmailService;
