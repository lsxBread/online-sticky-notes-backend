const express = require('express')
const Router = express.Router()
const utils = require('utility')
const model = require('./model')
const UserModel = model.getModel('users')
const _filter = { 'password': 0, '__v': 0 }

Router.get('/auth', (req, res) => {
	console.log(req.cookies)
	console.log(req.session)
	if (req.session.user) {
		return res.json({ code: 0, data: req.session.user, msg: 'Login Success' })
	} else {
		return res.json({ code: 1, msg: 'Please Login' })	
	}
})

Router.post('/login', (req, res) => {
	const { username, password } = req.body
	UserModel.findOne({ username, password: md5Pwd(password) }, _filter, (err, doc) => {
		if (!doc) {
			return res.json({ code: 1, msg: 'Incorrect username or password' })
		} else {
			req.session.user = doc
			return res.json({ code: 0, data: doc, msg: 'Login Success' })
		}
	})
})

Router.get('/logout', (req, res) => {
	if (req.session.user) {
		req.session.user = null
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
				return res.json({ code: 0, data: { username: r_username, password: r_password }, msg: "Register Success" })
			}
		})
	})
})

const md5Pwd = pwd => {
	const salt = 'lsx_11S102028&shixun.liu103@gmail.com'
	return utils.md5(utils.md5(pwd + salt))
}

module.exports = Router