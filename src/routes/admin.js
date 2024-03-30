const router = require('express-promise-router')()

const authController = require('../controllers/auth')
const clubController = require('../controllers/club')
const eventController = require('../controllers/event')
const notificationController = require('../controllers/notification')

const passport = require('passport')
const passportConfig = require('../middlewares/passport')
const { checkPermission } = require('../middlewares/checkPermission')

const { validateBody, schemas, validateParam } = require('../helpers/validator')

router.route('/user/register').post(validateBody(schemas.authRegisterSchema), authController.register)

//Club
router
	.route('/club')
	.get(passport.authenticate('jwt', { session: false }), checkPermission('admin'), clubController.getAllClubForAdmin)
	.post(
		passport.authenticate('jwt', { session: false }),
		checkPermission('admin'),
		validateBody(schemas.createClubSchema),
		clubController.createClub
	)

router.route('/clubs').get(passport.authenticate('jwt', { session: false }), clubController.getAllClubByLeader)

router
	.route('/club/:clubID/addMember')
	.post(
		passport.authenticate('jwt', { session: false }),
		checkPermission('club', 'admin'),
		validateParam(schemas.idSchema, 'clubID'),
		validateBody(schemas.addMemberSchema),
		clubController.addMember
	)

router
	.route('/club/:clubID/removeMember')
	.post(
		passport.authenticate('jwt', { session: false }),
		checkPermission('club', 'admin'),
		validateParam(schemas.idSchema, 'clubID'),
		validateBody(schemas.removeMemberSchema),
		clubController.removeMember
	)

router
	.route('/club/:clubID')

	.delete(
		validateParam(schemas.idSchema, 'clubID'),
		passport.authenticate('jwt', { session: false }),
		checkPermission('admin'),
		clubController.deleteClub
	)
	.put(
		validateParam(schemas.idSchema, 'clubID'),
		passport.authenticate('jwt', { session: false }),
		checkPermission('admin', 'club'),
		validateBody(schemas.updateClubSchema),
		clubController.updateClub
	)

//Event
router
	.route('/event/:clubID/create')
	.post(
		validateBody(schemas.createEventSchema),
		validateParam(schemas.idSchema, 'clubID'),
		passport.authenticate('jwt', { session: false }),
		checkPermission('club'),
		eventController.createEvent
	)

router
	.route('/event/:eventID')

	.delete(
		validateParam(schemas.idSchema, 'eventID'),
		passport.authenticate('jwt', { session: false }),
		checkPermission('club', 'admin'),
		eventController.deleteEvent
	)

	.put(
		validateParam(schemas.idSchema, 'eventID'),
		validateBody(schemas.eventSchema),
		passport.authenticate('jwt', { session: false }),
		checkPermission('club'),
		eventController.updateEvent
	)

router
	.route('/attendance/:eventID')
	.get(
		validateParam(schemas.idSchema, 'eventID'),
		passport.authenticate('jwt', { session: false }),
		checkPermission('admin', 'club'),
		eventController.getAttendances
	)

//Notification
router
	.route('/notification/:clubID')
	.post(
		passport.authenticate('jwt', { session: false }),
		checkPermission('club'),
		validateParam(schemas.idSchema, 'clubID'),
		validateBody(schemas.createNotificationSchema),
		notificationController.createNotification
	)
router
	.route('/notification/:notificationID')
	.delete(
		passport.authenticate('jwt', { session: false }),
		validateParam(schemas.idSchema, 'notificationID'),
		checkPermission('club'),
		notificationController.deleteNotification
	)
	.put(
		passport.authenticate('jwt', { session: false }),
		validateParam(schemas.idSchema, 'notificationID'),
		validateBody(schemas.notificationSchema),
		checkPermission('club'),
		notificationController.updateNotification
	)

module.exports = router
