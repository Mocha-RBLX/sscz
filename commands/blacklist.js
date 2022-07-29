const { MessageEmbed } = require("discord.js")
const mongo = require("../mongo")
const whitelist = require("../Schems/whitelist.js")
const time = require("../Schems/date.js")

module.exports.run = async (Client, message, args, Namebot, Color) => {
    const target = message.mentions.users.first() || message.guild.members.cache.get(args[1])
    const role = message.guild.roles.cache.find(r => r.name === "Premium")

    if(!message.member.roles.cache.some(role => role.name === 'Whitelister')) {
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
            .addField('Example User', "`~blacklist Văn Đô#6867`", false)
            .addField('Example UserID', "`~blacklist 809804156956835841`", false)
        return message.channel.send(Embed)
    }

    await mongo().then(async (mongoose) => {
        try {
            const member = message.guild.members.cache.get(target.id)
            const userid = target.id
            whitelist.find({DiscordId: userid}, (error, results) => {
                if(results.length) {
                    whitelist.findOneAndDelete({DiscordId: userid}, (a,b) => {
                        if(a) throw a
                        const EmbedDM = new MessageEmbed()
                            .setColor(Color)
                            .setDescription('**'+Namebot+'**')
                            .addField('Message', "You've been blacklisted", true)
                        member.send(EmbedDM)
                        const Embed = new MessageEmbed()
                            .setColor(Color)
                            .setDescription('**'+Namebot+'**')
                            .addField('Message', "Blacklisted <@!"+target.id+">!", true)
                        message.channel.send(Embed)
                        member.roles.remove(role)
                        time.findOneAndDelete({DiscordId: userid}, (aa,bb) => {})
                    })
                } else {
                    const Embed = new MessageEmbed()
                    .setColor(Color)
                    .setDescription('**'+Namebot+'**')
                    .addField('Message', `<@!${target.id}> is not Whitelisted`, true)
                    message.channel.send(Embed)
                }
            })
        } catch(e) {
            console.log(e)
        }
    })
}

module.exports.help = {
    name: ["blacklist", "niggalist", "bl"]
}