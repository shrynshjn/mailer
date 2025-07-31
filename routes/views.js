const express = require('express');
const router = express.Router();
const CampaignService = require('../services/campaign');
const EmailService = require('../services/email');

/**
 * @route   GET /
 * @desc    Render the home page
 */
router.get('/', (req, res) => {
  res.render('home', { title: 'Mailer Dashboard' });
});

/**
 * @route   GET /campaigns
 * @desc    Render the campaigns status page
 */
router.get('/campaigns', async (req, res, next) => {
  try {
    const { data } = await CampaignService.getAll();
    res.render('campaigns', { title: 'Campaign Status', campaigns: data.campaigns });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /campaigns/add
 * @desc    Render the form to create a new campaign
 */
router.get('/campaigns/add', async (req, res, next) => {
  try {
    const [emailsResponse, campaignsResponse] = await Promise.all([
      EmailService.getAll(),
      CampaignService.getAll()
    ]);
    res.render('campaign-form', {
      title: 'Create Campaign',
      action: '/campaigns/add',
      emails: emailsResponse.data.emails,
      campaigns: campaignsResponse.data.campaigns,
      campaign: {},
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /campaigns/add
 * @desc    Handle the creation of a new campaign from form
 */
router.post('/campaigns/add', async (req, res, next) => {
  try {
    const { name, emailId, scheduledTime, emails } = req.body;
    // Split emails from textarea into an array, trim whitespace, and filter out empty lines
    const emailList = emails.split(/\r?\n/).map(email => email.trim()).filter(email => email);

    await CampaignService.create({ name, emailId, scheduledTime, emails: emailList });
    res.redirect('/campaigns');
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /emails
 * @desc    Render the list of email templates
 */
router.get('/emails', async (req, res, next) => {
  try {
    const { data } = await EmailService.getAll();
    res.render('emails', { title: 'Email Templates', emails: data.emails });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /emails/add
 * @desc    Render the form to create a new email
 */
router.get('/emails/add', (req, res) => {
  res.render('email-form', { title: 'Create Email Template', action: '/emails/add', email: {} });
});

/**
 * @route   POST /emails/add
 * @desc    Handle the creation of a new email from form
 */
router.post('/emails/add', async (req, res, next) => {
  try {
    await EmailService.create(req.body);
    res.redirect('/emails');
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /emails/edit/:id
 * @desc    Render the form to edit an email
 */
router.get('/emails/edit/:id', async (req, res, next) => {
  try {
    const { data } = await EmailService.getById({ emailId: req.params.id });
    res.render('email-form', { title: 'Edit Email Template', action: `/emails/edit/${data.email._id}`, email: data.email });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /emails/edit/:id
 * @desc    Handle the update of an email from form
 */
router.post('/emails/edit/:id', async (req, res, next) => {
  try {
    await EmailService.update({ ...req.body, emailId: req.params.id });
    res.redirect('/emails');
  } catch (error) {
    next(error);
  }
});

module.exports = router;