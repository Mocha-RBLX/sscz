const { MessageEmbed } = require("discord.js")
const mongo = require("../mongo")
const whitelist = require("../Schems/whitelist.js")
const { Url } = require("../config.json")

module.exports.run = async(Client, message, args, Namebot, Color) => {
    try {
        await mongo().then(async(mongoose) => {
            try {
                const userid = message.author.id
                whitelist.find({ DiscordId: userid }, (error, results) => {
                    if (results.length) {
                        const key = results[0].UserKey
                        const EmbedDM = new MessageEmbed()
                            .setColor(Color)
                            .setDescription('**' + Namebot + '**')
                            .addField('Message', '**Do not share this script**', false)
                            .addField('Script', '```lua\ngetgenv().Key = "' + key + '"\nloadstring(game:HttpGet("''")
                        message.author.send(EmbedDM)
                        if (message.channel.type !== "dm") {
                            const EmbedREP = new MessageEmbed()
                                .setColor(Color)
                                .setTitle('**' + Namebot + '**')
                                .addField('Message', "Check your DM to get Premium Script", false)  
                            message.channel.send(EmbedREP)
                        }
                    } else {
                        const Embed = new MessageEmbed()
                            .setColor(Color)
                            .setDescription('**' + Namebot + '**')
                            .addField('Message', `You don't have permission`, true)
                        message.channel.send(Embed)
                    }
                })
            } catch (e) {
                console.log(e)
                const Embed = new MessageEmbed()
                    .setColor(Color)
                    .setDescription('**' + Namebot + '**')
                    .addField('Message', "try again got error", true)
                message.channel.send(Embed)
            }
        })
    } catch (e) {
        console.log(e)
        const Embed = new MessageEmbed()
            .setColor(Color)
            .setDescription('**' + Namebot + '**')
            .addField('Message', "try again got error", true)
        message.channel.send(Embed)
    }
}

module.exports.help = {
    name: ["script", "getscript", "spirit", "scirpt", "scritp", "sprint", "sprit"]
}