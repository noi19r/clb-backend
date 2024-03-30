const mongoose = require('mongoose')
const Schema = mongoose.Schema
const EventSchema = new Schema(
	{
		eventName: {
			type: String,
			required: true,
		},
		eventDescription: {
			type: String,
			required: true,
		},
		eventStartDate: {
			type: Date,
			required: true,
		},
		eventEndDate: {
			type: Date,
			required: true,
		},
		eventLocation: {
			type: String,
			required: true,
		},
		eventCreator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		eventOrganizer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Club',
		},
		eventParticipants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{ timestamps: true }
)
const Event = mongoose.model('Event', EventSchema)
module.exports = Event
