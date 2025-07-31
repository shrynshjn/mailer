const { model, Schema } = require("mongoose");

const schema = new Schema({
	name: {
		type: String,
		default: ''
	},
  emailId: {
    type: Schema.Types.ObjectId,
    default: null,
		required: true,
  },
	scheduledTime: {
		type: Date,
		default: null,
	},
  emails: {
    type: Array,
    default: [],
  },
  sent: [
    {
      email: String,
      success: Boolean,
      messageId: String,
      response: String,
      error: String,
    },
  ],

});

const Campaign = model('campaign', schema);
module.exports = Campaign;