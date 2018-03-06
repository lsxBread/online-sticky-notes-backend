const express = require('express')
const Router = express.Router()
const utils = require('utility')
const model = require('./model')
const UserModel = model.getModel('users')
const _filter = { 'password': 0, '__v': 0 }

Router.post('/update', (req, res) => {
	const { userid } = req.cookies
	if (!userid) {
		return res.json({ code: 1, msg: 'Not login' })
	}
	const body = req.body
	if (!body.avatar) {
		return res.json({ code: 1, msg: 'Please select avatar' })
	}
	UserModel.findByIdAndUpdate(userid, body, (err, doc) => {
		const data = Object.assign({}, {
			user: doc.user,
			type: doc.type
		}, body)
		return res.json({ data, code: 0, msg: 'Update Success' })
	})
})

Router.post('/login', (req, res) => {
	const { username, password } = req.body
	// UserModel.remove({}, (err, doc) => {})
	UserModel.findOne({ username, password: md5Pwd(password) }, _filter, (err, doc) => {
		if (!doc) {
			return res.json({ code: 1, msg: 'Incorrect username or password' })
		} else {
			res.cookie('userid', doc._id)
			return res.json({ code: 0, data: doc, msg: 'Login Success' })
		}
	})
})

Router.post('/register', (req, res) => {
	const { username, password} = req.body
	UserModel.findOne({ useranme: username }, (err, doc) => {
		if (doc) {
			return res.json({ code: 1, msg: 'Username alread exist' })
		}

		const temp = new UserModel({ username, password: md5Pwd(password) })
		temp.save((err, doc) => {
			if (err) {
				return res.json({ code: 1, msg: "Error in Server" })
			} else {
				const { username, _id } = doc
				res.cookie('userid', _id)
				return res.json({ code: 0, data: { username, _id }, msg: "Register Success" })
			}
		})
	})
})

const md5Pwd = pwd => {
	const salt = 'lsx_11S102028&shixun.liu103@gmail.com'
	return utils.md5(utils.md5(pwd + salt))
}

module.exports = Router