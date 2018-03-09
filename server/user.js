const express = require('express')
const Router = express.Router()
const passport = require('passport')
const GitHubStrategy = require('passport-github').Strategy;
const utils = require('utility')
const model = require('./model')
const UserModel = model.getModel('users')
const _filter = { 'password': 0, '__v': 0 }

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
		clientID: 'cdce22417eb4dfee4520',
		clientSecret: '8903912b9d5366e17d5829effa773890000a3733',
		callbackURL: "https://my-note-server.herokuapp.com/user/github/callback"
	},
	function(accessToken, refreshToken, profile, done) {
		done(null, profile);
	}
))

Router.get('/github',
  passport.authenticate('github'))

Router.get('/github/callback',
  passport.authenticate('github'),
  function(req, res) {
		let {login, id, avatar_url} = req.user._json
		req.session.user = {
			username: login,
			_id: id,
			avatar: avatar_url
		}
    res.redirect('https://onlinenotes.site/')
  })

Router.get('/auth', (req, res) => {

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
		req.session.destroy()
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