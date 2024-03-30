require('dotenv').config()
const config = require('./config')
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const mongoClient = require('mongoose')
const adminRoute = require('./routes/admin')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const clubRoute = require('./routes/club')
const eventRoute = require('./routes/event')
const notificationRoute = require('./routes/notification')

mongoClient
	.connect(config.db.mongoUrl, {
		// useNewUrlParser: true,
		// useUnifiedTopology: true,
	})
	.then(async () => {
		console.log('✅ Connected database from mongodb.')
	})
	.catch((error) => console.error(`❌ Connect database is failed with error which is ${error}`))

const app = express()

if (!config.isProduction) app.use(logger('dev'))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))

app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/club', clubRoute)
app.use('/admin', adminRoute)
app.use('/event', eventRoute)
app.use('/notification', notificationRoute)

app.get('/', (req, res, next) => {
	return res.status(201).json({
		success: true,
		message: 'Server is OK',
	})
})

app.use((req, res, next) => {
	const err = new Error('Not Found')
	err.status = 404
	next(err)
})

app.use((err, req, res, next) => {
	const status = err.status || 500
	return res.status(status).json({
		success: false,
		error: {
			message: err.message,
		},
	})
})

app.listen(config.app.port, () => console.log(`Server is listening on port ${config.app.port}`)).timeout = 10000
