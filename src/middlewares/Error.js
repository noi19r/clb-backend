const handleError = (error) => {
	const err = new Error(error.message)
	err.status = error.status
	throw err
}

module.exports = {
	handleError,
}
