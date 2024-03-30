const Notification = require('../models/Notification')
const User = require('../models/User')
const Club = require('../models/Club')

const createNotification = async (req, res, next) => {
	const { clubID } = req.value.params
	const { title, content } = req.value.body
	const club = await Club.findById(clubID)
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
				message: 'Bạn không có quyền tạo thông báo',
			},
		})
	const notification = new Notification({
		title,
		content,
		createdBy: req.user._id,
		club: clubID,
	})
	await notification.save()
	return res.status(201).json({
		success: true,
		data: {
			notification,
		},
	})
}

const getNotifications = async (req, res, next) => {
	const { clubID } = req.value.params
	const club = await Club.findById(clubID).populate('clubMembers', 'user')
	if (!club)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Club này không tồn tại',
			},
		})
	let isMember = club.clubMembers.find((member) => member.user.toString() === req.user._id.toString())
	if (!isMember)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Bạn không phải là thành viên của câu lạc bộ này',
			},
		})
	const notifications = await Notification.find({
		club: clubID,
	}).populate('createdBy', 'studentID fullName')

	return res.status(200).json({
		success: true,
		data: {
			notifications,
		},
	})
}

const getNotification = async (req, res, next) => {
	const { notificationID } = req.value.params
	const notification = await Notification.findById(notificationID)
		.populate('createdBy', 'studentID fullName')
		.populate('club', 'clubName')
	if (!notification)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Thông báo này không tồn tại',
			},
		})
	let isRead = notification.readBy.find((user) => user.toString() === req.user._id.toString())
	if (!isRead)
		await notification.updateOne({
			$addToSet: {
				readBy: req.user._id,
			},
		})
	notification.readBy = undefined
	return res.status(200).json({
		success: true,
		data: {
			notification,
		},
	})
}

const updateNotification = async (req, res, next) => {
	const { notificationID } = req.value.params
	const { title, content } = req.value.body
	const notification = await Notification.findById(notificationID)
	if (!notification)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Thông báo này không tồn tại',
			},
		})
	if (notification.createdBy.toString() !== req.user._id.toString())
		return res.status(400).json({
			success: false,
			error: {
				message: 'Bạn không có quyền chỉnh sửa thông báo này',
			},
		})
	await notification.updateOne({
		title,
		content,
	})
	return res.status(200).json({
		success: true,
		message: 'Cập nhật thông báo thành công',
		data: {},
	})
}
const deleteNotification = async (req, res, next) => {
	const { notificationID } = req.value.params
	const notification = await Notification.findById(notificationID)
	if (!notification)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Thông báo này không tồn tại',
			},
		})
	if (notification.createdBy.toString() !== req.user._id.toString())
		return res.status(400).json({
			success: false,
			error: {
				message: 'Bạn không có quyền xóa thông báo này',
			},
		})
	await notification.deleteOne()

	return res.status(200).json({
		success: true,
		message: 'Xóa thông báo thành công',
		data: {},
	})
}
module.exports = {
	createNotification,
	getNotifications,
	getNotification,
	updateNotification,
	deleteNotification,
}
