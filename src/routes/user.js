const router = require('express-promise-router')()
const userController = require('../controllers/user')
const passport = require('passport')
const { validateBody, schemas } = require('../helpers/validator')
router.route('/').get(passport.authenticate('jwt', { session: false }), userController.getUser)
router
	.route('/change-password')
	.post(
		passport.authenticate('jwt', { session: false }),
		validateBody(schemas.changePasswordSchema),
		userController.changePassword
	)

module.exports = router
