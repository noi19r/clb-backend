const User = require('../models/User')

const getUser = async (req, res, next) => {
	const { studentID, email, fullName, department, class: _class, role } = req.user

	return res.status(200).json({
		success: true,
		data: {
			studentID,
			email,
			fullName,
			department,
			class: _class,
			role,
		},
	})
}

const changePassword = async (req, res, next) => {
	const user = req.user
	const bodyUser = req.value.body
	if (bodyUser.password !== bodyUser.surePassword)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Mật khẩu mới không khớp nhau.',
			},
		})

	const isCorrectPassword = await user.isValidPassword(bodyUser.currentPassword)
	if (!isCorrectPassword)
		return res.status(403).json({
			success: false,
			error: {
				message: 'Mật khẩu cũ không đúng.',
			},
		})

	const newPassword = await user.isChangePassword(bodyUser.password)
	user.password = newPassword
	await user.save()
	return res.status(200).json({
		success: true,
		message: 'Đổi mật khẩu thành công.',
		data: {},
	})
}

module.exports = {
	getUser,
	changePassword,
}
