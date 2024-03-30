const mongoose = require('mongoose')
const Schema = mongoose.Schema
const NotificationSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		club: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Club',
		},
		readBy: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{ timestamps: true }
)
const Notification = mongoose.model('Notification', NotificationSchema)
module.exports = Notification
