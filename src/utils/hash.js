const crypto = require('crypto')
const md5 = (data) => crypto.createHash('md5').update(data).digest('hex')
const sha256 = (data) => crypto.createHash('sha256').update(data).digest('hex')

module.exports = {
	md5,
	sha256,
}
