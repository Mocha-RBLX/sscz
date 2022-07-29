const { MessageEmbed } = require("discord.js")
const mongo = require("../mongo")
const whitelist = require("../Schems/whitelist.js")
const redeem = require("../Schems/redeem.js")
const {RolePremiumId, GuildId} = require("../config.json")

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
    const target = message.author.id
    const code = args[1]

    const getguild = await Client.guilds.cache.get(GuildId)
    const role = await getguild.roles.cache.get(RolePremiumId)
    const user = await getguild.members.fetch(target)

    if(!code) {
        const Embed = new MessageEmbed()
            .setColor(Color)
            .setDescription('**'+Namebot+'**')
            .addField('Message', "Put a valid Code", false)
        return message.channel.send(Embed)
    }

    await mongo().then(async (mongoose) => {
        try {
            whitelist.find({DiscordId: target}, (error, results) => {
                if(!results.length) {
                    redeem.find({code: code}, (a, b) => {
                        if(a) throw a
                        if(b.length) {
                            if(b[0].used === 'false' || b[0].used === false) {
                                redeem.findOneAndUpdate({code: code}, { $set: { used: "true", DiscordId: target } }, {upsert: true}, (c, d) => {
                                    whitelist.findOneAndUpdate({DiscordId: target}, {UserKey: random(15)}, {upsert: true}, async (e, f) => {
                                        if(e) throw e
                                            const Embed = new MessageEmbed()
                                            .setColor(Color)
                                            .setDescription('**'+Namebot+'**')
                                            .addField('Message', 'Code redeemed', false)
                                            message.channel.send(Embed)
                                    })
                                })
                            } else {
                                const Embed = new MessageEmbed()
                                .setColor(Color)
                                .setDescription('**'+Namebot+'**')
                                .addField('Message', 'Code already redeemed', false)
                                message.channel.send(Embed)
                            }
                        } else {
                            const Embed = new MessageEmbed()
                            .setColor(Color)
                            .setDescription('**'+Namebot+'**')
                            .addField('Message', 'Invalid code', true)
                            message.channel.send(Embed)
                        }
                    })
                } else {
                    const Embed = new MessageEmbed()
                    .setColor(Color)
                    .setDescription('**'+Namebot+'**')
                    .addField('Message', "You already Whitelisted", true)
                    message.channel.send(Embed)
                }
            })
        } catch(e) {
            console.log(e)
        }
    })
}

module.exports.help = {
    name: ["redeem"]
}