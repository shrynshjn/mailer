const nodemailer = require("nodemailer");

// It's best practice to use environment variables for sensitive data
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use false for STARTTLS; true for SSL on port 465
  auth: {
    user: process.env.GMAIL_ID,
    pass: process.env.GMAIL_APP_PASSWD,
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
const sendMail = async (details = { to, subject, html, attachments: [] }) => {
  const {to, subject, html, attachments} = details;
  const info = await transporter.sendMail({
    from: `"${process.env.SENDER_NAME}" <${process.env.GMAIL_ID}>`,
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
