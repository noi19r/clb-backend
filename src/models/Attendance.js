const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AttendanceSchema = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		event: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Event',
		},
		status: {
			type: String,
			enum: ['present', 'absent', 'late', 'attend'], //'có mặt', 'vắng mặt', 'muộn', 'tham dự'
			default: 'attend',
		},
	},
	{ timestamps: true }
)
const Attendance = mongoose.model('Attendance', AttendanceSchema)
module.exports = Attendance
