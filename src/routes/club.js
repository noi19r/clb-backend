const router = require('express-promise-router')()
const clubController = require('../controllers/club')
const passport = require('passport')
const { validateBody, validateParam, schemas } = require('../helpers/validator')
const { checkPermission } = require('../middlewares/checkPermission')

router.route('/').get(passport.authenticate('jwt', { session: false }), clubController.getAllClub)

router
	.route('/:clubID')
	.get(
		validateParam(schemas.idSchema, 'clubID'),
		passport.authenticate('jwt', { session: false }),
		clubController.getClub
	)

module.exports = router
