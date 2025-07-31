const {model, Schema} = require('mongoose');

const schema = new Schema({
	name: {
		type: String,
		default: ''
	},
	title: {
		type: String,
		default: ''
	},
	content: {
		type: String,
		default: ''
	},
	attachments: {
		type: Array,
		default: []
	},
}, {timestamps: true})

const Email = model('email', schema);
module.exports = Email;