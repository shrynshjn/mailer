const nodemailer = require("nodemailer");

// It's best practice to use environment variables for sensitive data
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends an email.
 * @param {Object} mailOptions - The mail options.
 * @param {string} mailOptions.to - Recipient's email address.
 * @param {string} mailOptions.subject - Email subject.
 * @param {string} mailOptions.html - HTML body of the email.
 * @param {Array} [mailOptions.attachments=[]] - Email attachments.
 * @returns {Promise<Object>} The response object from nodemailer.
 */
const sendMail = async ({ to, subject, html, attachments = [] }) => {
  const info = await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
    to,
    subject,
    html,
    attachments,
  });
  return info;
};

const MailerService = {
	sendMail,
};

module.exports = MailerService;