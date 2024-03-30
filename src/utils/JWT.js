const { md5 } = require('./hash')
const { JWT_SECRET } = require('../config')
const JWT = require('jsonwebtoken')

const encodeToken = (userID, session) => {
	return JWT.sign(
		{
			iss: 'Clubs Management System',
			sub: userID,
			session: md5(session),
			iat: new Date().getTime(),
			exp: new Date().setDate(new Date().getDate() + 1),
		},
		JWT_SECRET
	)
}
module.exports = {
	encodeToken,
}
