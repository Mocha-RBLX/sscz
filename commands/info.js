const { MessageEmbed } = require("discord.js")
const mongo = require("../mongo")
const whitelist = require("../Schems/whitelist.js")

module.exports.run = async(Client, message, args, Namebot, Color) => {
    const target = message.mentions.users.first() || message.guild.members.cache.get(args[1]) || args[1]

    if (!message.member.roles.cache.some(role => role.name === 'Whitelister')) {
        const Embed = new MessageEmbed()
            .setColor(Color)
            .setDescription('**' + Namebot + '**')
            .addField('Message', "You don't have permission", true)
        return message.channel.send(Embed)
    }

    if (!target) {
        const Embed = new MessageEmbed()
            .setColor(Color)
            .setDescription('**' + Namebot + '**')
            .addField('Message', "Put a valid User or UserID or Key", false)
            .addField('Example User', "`~info Văn Đô#6867`", false)
            .addField('Example UserID', "`~info 809804156956835841`", false)
            .addField('Example Key', "`~info 33xC3ScGhcjHVNq`", false)
        return message.channel.send(Embed)
    }

    await mongo().then(async(mongoose) => {
        try {
            const userid = message.author.id
            var type
            if (target === message.mentions.users.first() || message.guild.members.cache.get(args[1])) {
                type = "ID"
            } else {
                type = "Key"
            }
            whitelist.find({
                $or: [{
                        DiscordId: target.id
                    },
                    {
                        UserKey: target
                    }
                ]
            }, (error, results) => {
                if (results.length) {
                    const EmbedREP = new MessageEmbed()
                        .setColor(Color)
                        .setTitle('' + Namebot + '')
                        .addField('Message', "Check your DM for info", false)
                    message.channel.send(EmbedREP)
                    const Embed = new MessageEmbed()
                        .setColor(Color)
                        .setDescription('**' + Namebot + '**')
                        .addField('Info', 'Discord ID: ```' + results[0].DiscordId + '```\n Key: ```' + results[0].UserKey + '```\n IP: ```' + results[0].IP + '```\n HWID: ```' + results[0].Hwid + '```', false)
                    message.author.send(Embed)
                } else {
                    if (type === "ID") {
                        const Embed = new MessageEmbed()
                            .setColor(Color)
                            .setDescription('**' + Namebot + '**')
                            .addField('Message', `<@!${target.id}> is not Whitelisted`, true)
                        message.channel.send(Embed)
                    } else {
                        const Embed = new MessageEmbed()
                            .setColor(Color)
                            .setDescription('**' + Namebot + '**')
                            .addField('Message', `${target} not found in Database`, true)
                        message.channel.send(Embed)
                    }
                }
            })
        } catch (e) {
            console.log(e)
        }
    })
}

module.exports.help = {
    name: ["info"]
}