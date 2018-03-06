const express = require('express')
const Router = express.Router()
const utils = require('utility')
const model = require('./model')
const UserModel = model.getModel('users')
const _filter = { 'password': 0, '__v': 0 }

Router.get('/info', (req, res) => {
	const { userid } = req.cookies
	if (!userid) {
		return res.json({ code: 1, msg: 'Please Login' })
	}
	UserModel.findById(userid , _filter, (err, doc) => {
		if (err) {
			return res.json({ code: 1, msg: 'Error in Server' })
		}
		if (doc) {
			return res.json({ code: 0, data: doc, msg: 'Login Success' })
		}
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

Router.get('/logout', (req, res) => {
	const { userid } = req.cookies
	if (userid) {
		res.cookie("userid", "", { expires: new Date(0)});
		return res.json({ code: 0 })	
	}
})

Router.post('/register', (req, res) => {
	const {r_username, r_password} = req.body
	UserModel.findOne({ username: r_username }, (err, doc) => {
		if (doc) {
			return res.json({ code: 1, msg: 'Username alread exist' })
		}

		const temp = new UserModel({ username: r_username, password: md5Pwd(r_password) })
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