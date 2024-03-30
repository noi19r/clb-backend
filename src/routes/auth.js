const router = require('express-promise-router')()

const authController = require('../controllers/auth')
const passport = require('passport')
const passportConfig = require('../middlewares/passport')

const { validateBody, schemas } = require('../helpers/validator')
router
	.route('/login')
	.post(validateBody(schemas.authLoginSchema), passport.authenticate('local', { session: false }), authController.login)
router.route('/register').post(validateBody(schemas.authRegisterSchema), authController.register)
router.route('/forget-session').post(passport.authenticate('jwt', { session: false }), authController.forgetSession)

module.exports = router
