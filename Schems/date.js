const mongoose = require('mongoose')
const { CooldownRs } = require('../config.json')

const DateSchema = mongoose.Schema({
    DiscordId: {
        type: String,
        required: true,
    },
    Time: {
        type: Number,
        default: 123456
    },
    Ngay: {
        type: Number,
        default: CooldownRs
    },
    Reset: {
        type: String,
        default: "false"
    }
})

let Date
try {
  Date = mongoose.model('Date')
} catch (error) {
  Date = mongoose.model('Date', DateSchema)
}

module.exports = Date