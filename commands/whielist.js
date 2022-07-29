const { MessageEmbed } = require("discord.js")
const mongo = require("../mongo")
const whitelist = require("../Schems/whitelist.js")

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
    const target = message.mentions.users.first() || message.guild.members.cache.get(args[1])
    const role = message.guild.roles.cache.find(r => r.name === "Premium")

    if(!message.member.roles.cache.some(role => .name === 'Whitelister')) {
        const Embed = new MessageEmbed()
            .setColor(Color)
            .setDescription('**'+Namebot+'**')
            .addField('Message', "You don't have permission", true)
        return message.channel.send(Embed)
    }

    if(!target) {
        const Embed = new MessageEmbed()
            .setColor(Color)
            .setDescription('**'+Namebot+'**')
            .addField('Message', "Put a valid User or UserID", false)
            .addField('Example User', "`~whitelist Văn Đô#6867`", false)
            .addField('Example UserID', "`~whitelist 809804156956835841`", false)
        return message.channel.send(Embed)
    }

    await mongo().then(async (mongoose) => {
        try {
            const member = message.guild.members.cache.get(target.id)
            const userid = target.id
            const Key = random(15)
            whitelist.find({DiscordId: userid}, (error, results) => {
                if(!results.length) {
                    whitelist.findOneAndUpdate({DiscordId: userid}, {UserKey: Key}, {upsert: true}, (a, b) => {
                        if(a) throw a
                        const EmbedDM = new MessageEmbed()
                            .setColor(Color)
                            .setDescription('**'+Namebot+'**')
                            .addField('Message', "You've been whitelisted", true)
                        member.send(EmbedDM)
                        const Embed = new MessageEmbed()
                            .setColor(Color)
                            .setDescription('**'+Namebot+'**')
                            .addField('Message', "Whitelisted <@!"+target.id+">!", true)
                        message.channel.send(Embed)
                        member.roles.add(role)
                    })
                } else {
                    const Embed = new MessageEmbed()
                    .setColor(Color)
                    .setDescription('**'+Namebot+'**')
                    .addField('Message', "<@!"+target.id+"> already Whitelisted", true)
                    message.channel.send(Embed)
                }
            })
        } catch(e) {
            console.log(e)
        }
    })
}

module.exports.help = {
    name: ["whitelist", "wl"]
}