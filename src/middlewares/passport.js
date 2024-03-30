const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy

const { ExtractJwt } = require('passport-jwt')

const { handleError } = require('./Error')
const User = require('../models/User')
const { JWT_SECRET } = require('../config')
const { md5 } = require('../utils/hash')
const { v4: uuid4 } = require('uuid')

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
			secretOrKey: JWT_SECRET,
		},
		async (payload, done) => {
			try {
				const user = await User.findById(payload.sub)

				if (!user)
					handleError({
						message: 'Không tìm thấy người dùng.',
						status: 401,
					})
				let checkTimeToken = payload.exp <= new Date().getTime()
				if (checkTimeToken || !user.session || md5(user.session) !== payload.session)
					handleError({
						message: 'Phiên đăng nhập đã hết hạn.',
						status: 401,
					})

				done(null, user)
			} catch (error) {
				done(error, false)
			}
		}
	)
)

passport.use(
	new LocalStrategy(
		{
			usernameField: 'studentID',
			passwordField: 'password',
		},
		async (studentID, password, done) => {
			try {
				const user = await User.findOne({
					studentID,
				})

				if (!user)
					handleError({
						message: 'Không tìm thấy người dùng.',
						status: 400,
					})

				const isCorrectPassword = await user.isValidPassword(password)

				if (!isCorrectPassword)
					handleError({
						message: 'Mật khẩu không đúng.',
						status: 400,
					})
				const session = uuid4()
				user.session = session
				await user.save()

				done(null, user)
			} catch (error) {
				done(error, false)
			}
		}
	)
)
