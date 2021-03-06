const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const redis = require('redis')
const RedisStore = require('connect-redis')(session)
const path = require('path')
const passport = require('passport')

const model = require('./server/model')
const usersModel = model.getModel('users')

const userRoute = require('./server/user')

const app = express()
const server = require('http').Server(app)

// 创建Redis客户端
var redisClient = redis.createClient(process.env.REDIS_URL);
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: 'password',
    resave: false,
    saveUninitialized: false, // 建议使用 128 个字符的随机字符串
    cookie: { maxAge: 60 * 1000 * 24* 60 }
}))
app.use(cors({ credentials: true, origin: ['http://localhost:3000', 'https://onlinenotes.site','https://online-sticky-notes.firebaseapp.com'] }))
app.use(cookieParser())
app.use(bodyParser.json())
app.use('/user', userRoute)

server.listen(process.env.PORT || 9093, () => {
    console.log('Node app start at port 9093')
})
