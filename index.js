const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const model = require('./server/model')
const usersModel= model.getModel('users')
const app = express() 
const server = require('http').Server(app)

const userRoute = require('./server/user')

app.use(cors({credentials: true, origin: ['http://localhost:3000','https://online-sticky-notes.firebaseapp.com']})) 
app.use(cookieParser())
app.use(bodyParser.json())
app.use('/user', userRoute)
server.listen(process.env.PORT || 9093, () => {
    console.log('Node app start at port 9093')
})
