const router = require('express-promise-router')()
const notificationController = require('../controllers/notification')

const passport = require('passport')
const { validateBody, validateParam, schemas } = require('../helpers/validator')
const { checkPermission } = require('../middlewares/checkPermission')

router
	.route('/:clubID')
	.get(
		passport.authenticate('jwt', { session: false }),
		validateParam(schemas.idSchema, 'clubID'),
		notificationController.getNotifications
	)

router
	.route('/:notificationID/read')
	.get(
		passport.authenticate('jwt', { session: false }),
		validateParam(schemas.idSchema, 'notificationID'),
		notificationController.getNotification
	)
module.exports = router
