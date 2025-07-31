const {model, Schema} = require('mongoose');

const schema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	title: {
		type: String,
		required: true,
		trim: true,
	},
	content: {
		type: String,
		required: true,
	},
	attachments: {
		type: Array,
		default: []
	},
}, {timestamps: true})

const Email = model('email', schema);
module.exports = Email;