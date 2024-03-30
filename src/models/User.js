const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const UserSchema = new Schema(
	{
		studentID: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			lowercase: true,
			match: [/\S+@\S+\.\S+/, 'is invalid'],
			required: true,
			unique: true,
		},
		fullName: String,
		department: String,
		class: String,
		session: String,
		clubs: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Club',
			},
		],
		role: {
			type: [String],
			enum: ['user', 'club', 'admin'],
			default: ['user'],
		},
	},
	{ timestamps: true }
)
UserSchema.pre('save', async function (next) {
	try {
		if (this.isNew) {
			const salt = await bcrypt.genSalt(10)
			const passwordHashed = await bcrypt.hash(this.password, salt)
			this.password = passwordHashed
		}
		next()
	} catch (error) {
		next(error)
	}
})

UserSchema.methods.isValidPassword = async function (newPassword) {
	try {
		return await bcrypt.compare(newPassword, this.password)
	} catch (error) {
		throw new Error(error)
	}
}

UserSchema.methods.isChangePassword = async function (newPassword) {
	try {
		const salt = await bcrypt.genSalt(10)

		return await bcrypt.hash(newPassword, salt)
	} catch (error) {
		throw new Error(error)
	}
}

const User = mongoose.model('User', UserSchema)
module.exports = User
