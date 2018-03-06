// connect to mongo
const mongoose = require('mongoose')
const DB_URL = 'mongodb://lsx1988:lsx_1988@ds155278.mlab.com:55278/sticky-notes'
mongoose.connect(DB_URL)
mongoose.connection.on('connected', () => {
    console.log('Mongo connect success')
})

const models = {
    users: {
        'username': {type: String, require:true},
        'password': {type: String, require:true},
    },
}

for (let m in models) {
    mongoose.model(m, new mongoose.Schema(models[m]))
}

module.exports = {
    getModel: (name) => {
        return mongoose.model(name);
    }
}