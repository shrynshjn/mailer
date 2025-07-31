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
  sent: {
    type: Array,
    default: [],
  },

});

const Campaign = model('campaign', schema);
module.exports = Campaign;