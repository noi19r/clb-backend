const Joi = require('joi').extend(require('@joi/date'))

const validateBody = (schema) => {
	return (req, res, next) => {
		const result = schema.validate(req.body)
		if (result.error) {
			return res.status(400).json({
				success: false,
				error: { message: result.error.details[0].message },
			})
		}
		if (!req.value) req.value = {}
		req.value.body = result.value
		next()
	}
}

const validateParam = (schema, name) => {
	return (req, res, next) => {
		const result = schema.validate({ param: req.params[name] })
		if (result.error) {
			return res.status(400).json({
				success: false,
				error: { message: result.error.details[0].message },
			})
		}
		if (!req.value) req.value = {}
		if (!req.value.params) req.value.params = {}
		req.value.params[name] = req.params[name]
		next()
	}
}
const validateQuery = (schema) => {
	return (req, res, next) => {
		const result = schema.validate(req.query)
		if (result.error) {
			return res.status(400).json({
				success: false,
				error: { message: result.error.details[0].message },
			})
		}
		if (!req.value) req.value = {}
		req.value.query = result.value
		next()
	}
}

const schemas = {
	idSchema: Joi.object().keys({
		param: Joi.string()
			.regex(/^[0-9a-zA-Z]{24}$/)
			.required(),
	}),

	authLoginSchema: Joi.object().keys({
		studentID: Joi.number().required().messages({
			'string.empty': 'Mã sinh viên không được để trống',
		}),
		password: Joi.string().required(),
	}),
	authRegisterSchema: Joi.object().keys({
		studentID: Joi.number().required().messages({
			'string.empty': 'Mã sinh viên không được để trống',
		}),
		password: Joi.string().required(),
		email: Joi.string().email().required(),
		fullName: Joi.string().required(),
		department: Joi.string().required(),
		class: Joi.string().required(),
	}),

	changePasswordSchema: Joi.object().keys({
		password: Joi.string().min(6).required().messages({
			'string.min': `Mật khẩu cần ít nhât 6 kí tự`,
			'string.empty': `Mật khẩu không được bỏ trống`,
			'any.required': `Thiếu mật khẩu gửi lên`,
		}),
		currentPassword: Joi.string().min(6).required().messages({
			'string.min': `Mật khẩu cần ít nhât 6 kí tự`,
			'string.empty': `Mật khẩu không được bỏ trống`,
			'any.required': `Thiếu mật khẩu gửi lên`,
		}),
		surePassword: Joi.string().min(6).required().messages({
			'string.min': `Mật khẩu cần ít nhât 6 kí tự`,
			'string.empty': `Mật khẩu không được bỏ trống`,
			'any.required': `Thiếu mật khẩu gửi lên`,
		}),
	}),
	addMemberSchema: Joi.object().keys({
		studentID: Joi.number().required().messages({
			'string.empty': 'Mã sinh viên không được để trống',
		}),
	}),
	removeMemberSchema: Joi.object().keys({
		studentID: Joi.number().required().messages({
			'string.empty': 'Mã sinh viên không được để trống',
		}),
	}),
	updateClubSchema: Joi.object().keys({
		clubName: Joi.string(),
		clubDescription: Joi.string(),
		clubLogo: Joi.string(),
		clubCover: Joi.string(),
	}),
	createClubSchema: Joi.object().keys({
		clubName: Joi.string().required(),
		clubDescription: Joi.string().required(),
		clubLogo: Joi.string().required(),
		clubCover: Joi.string().required(),
		clubLeader: Joi.number().required().messages({
			'string.empty': 'Mã sinh viên không được để trống',
		}),
	}),
	createEventSchema: Joi.object().keys({
		eventName: Joi.string().required(),
		eventDescription: Joi.string().required(),
		eventStartDate: Joi.date().format('DD/MM/YYYY HH:mm').required(),
		eventEndDate: Joi.date().format('DD/MM/YYYY HH:mm').required(),
		eventLocation: Joi.string().required(),
	}),
	eventSchema: Joi.object().keys({
		eventName: Joi.string(),
		eventDescription: Joi.string(),
		eventStartDate: Joi.date().format('DD/MM/YYYY HH:mm'),
		eventEndDate: Joi.date().format('DD/MM/YYYY HH:mm'),
		eventLocation: Joi.string(),
	}),
	notificationSchema: Joi.object().keys({
		title: Joi.string(),
		content: Joi.string(),
	}),
	createNotificationSchema: Joi.object().keys({
		title: Joi.string().required(),
		content: Joi.string().required(),
	}),

	/*
    TODO: Implement register schema
	registerSchema: Joi.object().keys({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
		fullName: Joi.string().required(),
		department: Joi.string().required(),
		class: Joi.string().required(),
		session: Joi.string().required(),
	}),
    */

	forgetSessionSchema: Joi.object().keys({
		session: Joi.string().required(),
	}),
	refreshSessionSchema: Joi.object().keys({
		session: Joi.string().required(),
	}),
}

module.exports = {
	validateBody,
	validateParam,
	validateQuery,
	schemas,
}
