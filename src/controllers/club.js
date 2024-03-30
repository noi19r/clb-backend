const Club = require('../models/Club')
const User = require('../models/User')

const getAllClubForAdmin = async (req, res, next) => {
	const result = await Club.find({}).populate('clubLeader', 'studentID fullName').populate({
		path: 'clubMembers.user',
		select: 'studentID fullName',
	})
	return res.status(200).json({
		success: true,
		data: {
			clubs: result,
		},
	})
}

const getAllClubByLeader = async (req, res, next) => {
	const result = await Club.find({ clubLeader: req.user._id }).populate('clubLeader', 'studentID fullName').populate({
		path: 'clubMembers.user',
		select: 'studentID fullName',
	})
	return res.status(200).json({
		success: true,
		data: {
			clubs: result,
		},
	})
}

const getAllClub = async (req, res, next) => {
	const result = await User.findById(req.user._id)
		.select({
			clubs: 1,
			_id: 0,
		})
		.populate({
			path: 'clubs',
			select: {
				clubMembers: 0,
				updatedAt: 0,
			},
			populate: {
				path: 'clubLeader',
				select: {
					studentID: 1,
					fullName: 1,
				},
			},
		})
	return res.status(200).json({
		success: true,
		data: {
			clubs: result.clubs,
		},
	})
}

const getClub = async (req, res, next) => {
	const { clubID } = req.value.params
	const club = await Club.findById(clubID, {}).populate('clubLeader', 'studentID fullName').populate({
		path: 'clubMembers.user',
		select: 'studentID fullName',
	})

	if (!club) {
		return res.status(404).json({
			success: false,
			error: {
				message: 'Không tìm thấy câu lạc bộ này',
			},
		})
	}

	return res.status(200).json({
		success: true,
		data: {
			club,
		},
	})
}

const createClub = async (req, res, next) => {
	const bodyClub = req.value.body

	let user = await User.findOne({ studentID: bodyClub.clubLeader })
	if (!user)
		return res.status(404).json({
			success: false,
			error: {
				message: 'Không tìm thấy người dùng này',
			},
		})
	let checkClub = await Club.findOne({ clubName: bodyClub.clubName })
	if (checkClub)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Tên câu lạc bộ đã tồn tại',
			},
		})

	const fakeBody = {
		clubName: 'Khoa đa thiên tài',
		clubDescription: 'clubDescription',
		clubLogo: 'clubLogo',
		clubCover: 'clubCover',
		clubLeader: user._id,
	}

	const newClub = new Club({
		clubLeader: user._id,
		clubName: bodyClub.clubName,
		clubDescription: bodyClub.clubDescription,
		clubLogo: bodyClub.clubLogo,
		clubCover: bodyClub.clubCover,
		clubMembers: [
			{
				user: user._id,
				joinDate: Date.now(),
			},
		],
	})
	await newClub.save()
	await User.findByIdAndUpdate(user._id, {
		$push: {
			clubs: newClub._id,
		},
	})

	return res.status(201).json({
		success: true,
		data: {
			club: newClub,
		},
	})
}

const addMember = async (req, res, next) => {
	const { clubID } = req.value.params
	const { studentID } = req.value.body

	const club = await Club.findById(clubID)
	if (!club)
		return res.status(404).json({
			success: false,
			error: {
				message: 'Không tìm thấy câu lạc bộ này',
			},
		})
	if (club.clubLeader != req.user._id && !req.user.role.includes('admin'))
		return res.status(403).json({
			success: false,
			error: {
				message: 'xBạn không có quyền thêm thành viên vào câu lạc bộ này',
			},
		})

	const user = await User.findOne({ studentID })
	if (!user)
		return res.status(404).json({
			success: false,
			error: {
				message: 'Không tìm thấy thành viên này',
			},
		})

	const isMember = club.clubMembers.find((member) => member.user.toString() === user._id.toString())
	if (isMember)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Người dùng này đã là thành viên của câu lạc bộ',
			},
		})
	await user.updateOne({
		$push: {
			clubs: club._id,
		},
	})

	await Club.findByIdAndUpdate(clubID, {
		$push: {
			clubMembers: {
				user: user._id,
				joinDate: Date.now(),
			},
		},
	})

	return res.status(200).json({
		success: true,
		message: 'Thêm thành viên thành công',
		data: {},
	})
}

const removeMember = async (req, res, next) => {
	const { clubID } = req.value.params
	const { studentID } = req.value.body
	const club = await Club.findById(clubID)
	if (!club)
		return res.status(404).json({
			success: false,
			error: {
				message: 'Không tìm thấy câu lạc bộ này',
			},
		})

	if (club.clubLeader != req.user._id && !req.user.role.includes('admin'))
		return res.status(403).json({
			success: false,
			error: {
				message: 'Bạn không có quyền xóa thành viên khỏi câu lạc bộ này',
			},
		})

	const user = await User.findOne({ studentID })
	if (!user)
		return res.status(404).json({
			success: false,
			error: {
				message: 'Không tìm thấy thành viên này',
			},
		})

	const isMember = club.clubMembers.find((member) => member.user.toString() === user._id.toString())
	if (!isMember)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Người dùng này không phải là thành viên của câu lạc bộ',
			},
		})

	await user.updateOne({
		$pull: {
			clubs: club._id,
		},
	})

	await Club.findByIdAndUpdate(
		clubID,
		{
			$pull: {
				clubMembers: {
					user: user._id,
				},
			},
		},
		{ multi: true }
	)
	return res.status(200).json({
		success: true,
		message: 'Xóa thành viên thành công',
		data: {},
	})
}

const updateClub = async (req, res, next) => {
	const { clubID } = req.value.params
	const bodyClub = req.value.body
	const club = await Club.findById(clubID)
	if (!club)
		return res.status(400).json({
			success: false,
			error: {
				message: 'Không tìm thấy câu lạc bộ này',
			},
		})
	if (club.clubLeader != req.user._id && !req.user.role.includes('admin'))
		return res.status(403).json({
			success: false,
			error: {
				message: 'Bạn không có quyền thay đổi trong câu lạc bộ này',
			},
		})

	await club.updateOne(bodyClub)
	return res.status(200).json({
		success: true,
		message: 'Cập nhật thông tin câu lạc bộ thành công',
		data: {},
	})
}

const deleteClub = async (req, res, next) => {
	let { clubID } = req.value.params
	const club = await Club.findById(clubID)
	if (!club)
		return res.status(404).json({
			success: false,
			error: {
				message: 'Không tìm thấy câu lạc bộ này',
			},
		})
	await Club.findByIdAndDelete(clubID)

	await User.updateMany(
		{
			clubs: club._id,
		},
		{
			$pull: {
				clubs: club._id,
			},
		}
	)

	return res.status(200).json({
		success: true,
		message: 'Xóa câu lạc bộ thành công',
		data: {},
	})
}
module.exports = {
	getAllClub,
	createClub,
	getClub,
	addMember,
	removeMember,
	getAllClubByLeader,
	getAllClubForAdmin,
	updateClub,
	deleteClub,
}
