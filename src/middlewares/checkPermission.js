const checkPermission = (permission) => {
	return (req, res, next) => {
		let { role } = req.user
		if (!role.some((item) => [permission].includes(item))) {
			return res.status(403).json({
				success: false,
				error: {
					message: 'Bạn không có quyền truy cập!!!',
				},
			})
		}
		next()
	}
}

module.exports = {
	checkPermission,
}
