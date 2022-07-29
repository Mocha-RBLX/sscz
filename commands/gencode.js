const { MessageEmbed } = require("discord.js")
const mongo = require("../mongo")
const Redeem = require("../Schems/redeem.js")

function random(length) {
    var result  = ''
    var characters  = 'abcdefgh0123456789'
    var charactersLength = characters.length
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
   }
   return result
}

module.exports.run = async (Client, message, args, Namebot, Color) => {
    const userid = message.author.id

    if(!message.member.roles.cache.some(role => role.name === 'Whitelister')) {
        const Embed = new MessageEmbed()
            .setColor(Color)
            .setDescription('**'+Namebot+'**')
            .addField('Failed', "You don't have permission", true)
        return message.channel.send(Embed)
    }

    function isInt(value) {
        return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
    }

    await mongo().then(async (mongoose) => {
        try {
            var codes = ''
            var looptime = 1
            if(isInt(args[1])) {
                looptime = args[1]
            }
            for (let step = 0; step < looptime; step++) {
                const Key = random(10)
                Redeem.findOneAndUpdate({code: Key}, {creator: userid}, {upsert: true}, async (e, b) => {
                    if(e) throw e
                })
                if(step === looptime - 1){
                    codes = codes + Key
                } else {
                    codes = codes + Key + " "
                }
            }
            if(!args[1]) {
                const EmbedDM = new MessageEmbed()
                .setColor(Color)
                .setDescription('**'+Namebot+'**')
                .addField('Code', "```"+codes+"```", true)
                .addField('Use', '`!redeem '+codes+'`')
                message.author.send(EmbedDM)
            } else {
                const EmbedDM = new MessageEmbed()
                .setColor(Color)
                .setDescription('**'+Namebot+'**')
                .addField('Code', "```"+codes+"```", true)
                .addField('Use', '`!redeem '+codes+'`')
                message.author.send(EmbedDM)
            }
            const EmbedREP = new MessageEmbed()
            .setColor(Color)
            .setTitle(''+Namebot+'')
            .addField('Success', "Code created, check your DM", false)
            message.channel.send(EmbedREP)
        } catch(e) {
            console.log(e)
        }
    })
}

module.exports.help = {
    name: ["gencode", "gc"]
}