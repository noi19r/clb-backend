const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ClubSchema = new Schema(
	{
		clubName: {
			type: String,
			required: true,
			unique: true,
		},
		clubDescription: {
			type: String,
			required: true,
		},
		clubLogo: {
			type: String,
			required: true,
		},
		clubCover: {
			type: String,
			required: true,
		},
		clubLeader: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		clubMembers: [
			{
				joinDate: {
					type: Date,
					default: Date.now,
				},
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
			},
		],
		// events: [
		// 	{
		// 		type: mongoose.Schema.Types.ObjectId,
		// 		ref: 'Event',
		// 	},
		// ],
	},
	{ timestamps: true }
)

const Club = mongoose.model('Club', ClubSchema)
module.exports = Club
