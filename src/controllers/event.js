const User = require('../models/User')
const Club = require('../models/Club')
const Event = require('../models/Event')
const Attendance = require('../models/Attendance')
const moment = require('moment')
const mongoose = require('mongodb')
const getAllEvent = async (req, res, next) => {
	const { clubID } = req.value.params
	const club = await Club.findOne({ _id: clubID, $or: [{ clubLeader: req.user._id }, { clubMembers: req.user._id }] })
	if (!club)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Club này không tồn tại',
			},
		})

	const result = await Event.find({ eventOrganizer: clubID })
		.populate('eventCreator', 'studentID fullName')
		.populate({
			path: 'eventOrganizer',
			select: 'clubName',
		})
		.populate({
			path: 'eventParticipants',
			select: 'studentID fullName',
		})

	return res.status(200).json({
		success: true,
		data: {
			events: result,
		},
	})
}

const createEvent = async (req, res, next) => {
	let { clubID } = req.value.params
	const bodyEvent = req.value.body
	const club = await Club.findById(clubID)
	let startDate = moment(bodyEvent.eventStartDate, 'DD/MM/YYYY HH:mm')
	let endDate = moment(bodyEvent.eventEndDate, 'DD/MM/YYYY HH:mm')

	if (!club)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Club này không tồn tại',
			},
		})

	if (club.clubLeader.toString() !== req.user._id.toString())
		return res.status(400).json({
			success: false,
			error: {
				message: 'Bạn không có quyền tạo sự kiện',
			},
		})
	if (startDate < Date.now() || endDate < Date.now() || startDate > endDate || startDate === endDate)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Thời gian không hợp lệ',
			},
		})

	const event = new Event({
		eventName: bodyEvent.eventName,
		eventDescription: bodyEvent.eventDescription,
		eventStartDate: startDate,
		eventEndDate: endDate,
		eventLocation: bodyEvent.eventLocation,
		eventCreator: req.user._id,
		eventOrganizer: clubID,
	})
	await event.save()
	return res.status(201).json({
		success: true,
		data: {
			event,
		},
	})
}

const deleteEvent = async (req, res, next) => {
	let { eventID } = req.value.params
	const event = await Event.findById(eventID).populate('eventOrganizer', 'clubLeader')
	if (!event)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Event này không tồn tại',
			},
		})
	if (event.eventOrganizer.clubLeader.toString() !== req.user._id.toString() && !req.user.role.includes('admin'))
		return res.status(400).json({
			success: false,
			error: {
				message: 'Bạn không có quyền xóa sự kiện này',
			},
		})

	await Event.findByIdAndDelete(eventID)
	await Attendance.deleteMany({ event: eventID })

	return res.status(200).json({
		success: true,
		message: 'Xóa event thành công',
		data: {},
	})
}

const updateEvent = async (req, res, next) => {
	let { eventID } = req.value.params
	const bodyEvent = req.value.body
	let startDate = moment(bodyEvent.eventStartDate, 'DD/MM/YYYY HH:mm')
	let endDate = moment(bodyEvent.eventEndDate, 'DD/MM/YYYY HH:mm')

	const event = await Event.findById(eventID).populate('eventOrganizer', 'clubLeader')
	if (!event)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Event này không tồn tại',
			},
		})
	if (event.eventOrganizer.clubLeader.toString() !== req.user._id.toString() && !req.user.role.includes('admin'))
		return res.status(400).json({
			success: false,
			error: {
				message: 'Bạn không có quyền xóa sự kiện này',
			},
		})

	if (startDate < Date.now() || endDate < Date.now() || startDate > endDate || startDate === endDate)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Thời gian không hợp lệ',
			},
		})
	await event.updateOne(bodyEvent)
	return res.status(200).json({
		success: true,
		message: 'Cập nhật thông tin sự kiện thành công',
		data: {},
	})
}

const getEvent = async (req, res, next) => {
	let { eventID } = req.value.params
	const event = await Event.findById(eventID)
		.populate('eventCreator', 'studentID fullName')
		.populate({
			path: 'eventOrganizer',
			select: 'clubName clubMembers',
		})
		.populate({
			path: 'eventParticipants',
			select: 'studentID fullName',
		})

	if (!event)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Event này không tồn tại',
			},
		})
	let isMember = event.eventOrganizer.clubMembers.find((member) => member.user.toString() === req.user._id.toString())
	if (!isMember)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Bạn chưa là thành viên nên không thể xem sự kiện này',
			},
		})
	event.eventOrganizer.clubMembers = undefined
	return res.status(200).json({
		success: true,
		data: {
			event,
		},
	})
}

const joinEvent = async (req, res, next) => {
	let { eventID } = req.value.params
	const event = await Event.findOne({
		_id: eventID,
	}).populate('eventOrganizer', 'clubMembers')

	if (!event)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Event này không tồn tại',
			},
		})

	let isMember = event.eventOrganizer.clubMembers.find((member) => member.user.toString() === req.user._id.toString())
	if (!isMember)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Bạn chưa là thành viên nên không thể tham gia sự kiện này',
			},
		})

	if (event.eventStartDate < Date.now())
		return res.status(400).json({
			success: false,
			error: {
				message: 'Event này đã diễn ra',
			},
		})
	if (event.eventEndDate < Date.now())
		return res.status(400).json({
			success: false,
			error: {
				message: 'Event này đã kết thúc',
			},
		})

	if (event.eventParticipants.includes(req.user._id))
		return res.status(400).json({
			success: false,
			error: {
				message: 'Bạn đã tham gia sự kiện này',
			},
		})
	await event.updateOne({
		$push: {
			eventParticipants: req.user._id,
		},
	})
	await Attendance.create({
		user: req.user._id,
		event: eventID,
		status: 'attend',
	})

	return res.status(200).json({
		success: true,
		message: 'Tham gia sự kiện thành công',
		data: {},
	})
}

const changeStatus = async (req, res, next) => {
	let { eventID } = req.value.params

	const event = await Event.findOne({
		_id: eventID,
		eventParticipants: req.user._id,
	}).populate('eventOrganizer', 'clubMembers')
	if (!event)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Event này không tồn tại',
			},
		})
	let isMember = event.eventOrganizer.clubMembers.find((member) => member.user.toString() === req.user._id.toString())
	if (!isMember)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Bạn chưa là thành viên nên không thể tham gia sự kiện này',
			},
		})
	if (!event.eventParticipants.includes(req.user._id))
		return res.status(400).json({
			success: false,
			error: {
				message: 'Bạn chưa đăng kí tham gia sự kiện này',
			},
		})
	const attendance = await Attendance.findOne({
		user: req.user._id,
		event: eventID,
	})
	if (!attendance)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Bạn chưa đăng kí tham gia sự kiện này',
			},
		})

	if (attendance.status === 'present')
		return res.status(400).json({
			success: false,
			error: {
				message: 'Bạn đã điểm danh rồi',
			},
		})

	let timeEndEvent = new Date(event.eventEndDate.getTime() + 5 * 60000)
	if (timeEndEvent < Date.now())
		return res.status(400).json({
			success: false,
			error: {
				message: 'Đã quá thời gian điểm danh',
			},
		})

	let status = 'attend'

	if (event.eventEndDate > Date.now()) status = 'present'
	else if (timeEndEvent > Date.now()) status = 'late'
	else status = 'absent'

	await Attendance.findByIdAndUpdate(attendance._id, {
		status,
	})

	return res.status(200).json({
		success: true,
		message: 'Điểm danh thành công',
		data: {},
	})
}

const getAttendances = async (req, res, next) => {
	let { eventID } = req.value.params
	const event = await Event.findById(eventID)
	if (!event)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Event này không tồn tại',
			},
		})

	const attendances = await Attendance.find({ event: eventID }).populate('user', 'studentID fullName').populate({
		path: 'event',
		select: 'eventName',
	})
	const statusCount = {
		present: 0,
		absent: 0,
		late: 0,
		attend: 0,
	}
	attendances.forEach((attendance) => {
		statusCount[attendance.status]++
	})

	//TODO SUM STATUS
	// const result = await Attendance.aggregate([
	// 	{
	// 		$match: {
	// 			event: eventID,
	// 		},
	// 	},
	// 	{
	// 		$group: {
	// 			_id: '$status',
	// 			count: { $sum: 1 },
	// 		},
	// 	},
	// ])
	// console.log('Thống kê trạng thái:', result)

	return res.status(200).json({
		success: true,
		data: {
			attendances,
			statusCount,
		},
	})
}

module.exports = {
	getAllEvent,
	createEvent,
	deleteEvent,
	updateEvent,
	getEvent,
	joinEvent,
	changeStatus,
	getAttendances,
}
