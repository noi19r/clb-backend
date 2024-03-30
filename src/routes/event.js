const router = require('express-promise-router')()
const eventController = require('../controllers/event')

const passport = require('passport')
const { validateBody, validateParam, schemas } = require('../helpers/validator')
const { checkPermission } = require('../middlewares/checkPermission')

router
	.route('/:clubID')
	.get(
		validateParam(schemas.idSchema, 'clubID'),
		passport.authenticate('jwt', { session: false }),
		eventController.getAllEvent
	)

router
	.route('/:eventID/getEvent')
	.get(
		validateParam(schemas.idSchema, 'eventID'),
		passport.authenticate('jwt', { session: false }),
		eventController.getEvent
	)

router
	.route('/:eventID/attendance')
	.get(
		validateParam(schemas.idSchema, 'eventID'),
		passport.authenticate('jwt', { session: false }),
		eventController.joinEvent
	)
	.post(
		validateParam(schemas.idSchema, 'eventID'),
		passport.authenticate('jwt', { session: false }),
		eventController.changeStatus
	)

module.exports = router
