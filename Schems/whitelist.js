const mongoose = require('mongoose')

const WhitelistSchema = mongoose.Schema({
    DiscordId: {
        type: String,
        required: true,
    },
    UserKey: {
        type: String,
        required: true,
    },
    Hwid: {
        type: String,
        default: "Unknown"
    },
    IP: {
        type: String,
        default: "Unknown"
    },
    Booster: {
        type: String,
        default: "false"
    },
    notes: {
        type: String,
        default: ""
    },
})

let whitelist
try {
  whitelist = mongoose.model('whitelists')
} catch (error) {
  whitelist = mongoose.model('whitelists', WhitelistSchema)
}

module.exports = whitelist