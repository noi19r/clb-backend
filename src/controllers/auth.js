const User = require('../models/User')

const { encodeToken } = require('../utils/JWT')
const login = async (req, res, next) => {
	const token = encodeToken(req.user._id, req.user.session)
	res.setHeader('Authorization', token)

	return res.status(200).json({
		success: true,
		data: {
			token,
		},
	})
}

const register = async (req, res, next) => {
	try {
		const { studentID, password, email, fullName, department, class: _class } = req.value.body

		const foundUser = await User.findOne({ $or: [{ email }, { studentID }] })
		if (foundUser)
			return res.status(403).json({
				success: false,
				error: {
					message: 'Mã số sinh viên hoặc email đã tồn tại trong hệ thống.',
				},
			})

		const newUser = new User({
			studentID,
			password,
			email,
			fullName,
			department,
			class: _class,
		})
		await newUser.save()
		newUser.password = undefined
		return res.status(201).json({
			success: true,
			data: {
				user: newUser,
			},
		})
	} catch (error) {
		next(error)
	}
}

const forgetSession = async (req, res, next) => {
	const { _id: userID } = req.user
	const result = await User.findByIdAndUpdate(userID, { session: null })
	return res.status(200).json({
		success: Boolean(result),
		data: {},
	})
}

//TODO: Implement this function later on (when we have a mail server)
const forgotPassword = async (req, res, next) => {}

module.exports = {
	login,
	register,
	forgetSession,
	forgotPassword,
}
