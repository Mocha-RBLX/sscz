const mongoose = require('mongoose')
const { Mongoo } = require('./config.json')

module.exports = async () => {
    if(!mongoose.connections[0].client) {
        mongoose.connect(Mongoo, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        },{server: { auto_reconnect: true }})
        console.log("connect database")
    }
    return mongoose
}