const urDBLocal = 'mongodb://localhost:27017/db-clb'
const urDBCloud = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
	isProduction,
	app: {
		port: process.env.PORT || 5000,
	},
	db: {
		host: process.env.DB_HOST || 'localhost',
		port: process.env.DB_PORT || 27017,
		name: process.env.DB_NAME || 'db-clb',
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		mongoUrl: isProduction ? urDBCloud : urDBLocal,
	},
	JWT_SECRET: process.env.JWT_SECRET,
}
