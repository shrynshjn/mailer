const { model, Schema } = require("mongoose");
const { CAMPAIGN_STATUS } = require("../config/constants");

const schema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
  emailId: {
    type: Schema.Types.ObjectId,
    default: null,
		required: true,
  },
	scheduledTime: {
		type: Date,
		required: true,
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
			accepted: Boolean,
    },
  ],
  status: {
    type: String,
    enum: Object.values(CAMPAIGN_STATUS),
    default: CAMPAIGN_STATUS.PENDING,
  },

});

const Campaign = model('campaign', schema);
module.exports = Campaign;