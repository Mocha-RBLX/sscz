const mongoose = require('mongoose')

const RedeemSchema = mongoose.Schema({
    DiscordId: {
        type: String,
        default: "Unknown"
    },

    code: {
        type: String,
        required: true,
    },

    used: {
        type: String,
        default: "false"
    },
    
    creator: {
        type: String,
        required: true,
    }
})

let redeems
try {
  redeems = mongoose.model('redeems')
} catch (error) {
  redeems = mongoose.model('redeems', RedeemSchema)
}

module.exports = redeems