const { MessageEmbed } = require("discord.js")
const mongo = require("../mongo")
const whitelist = require("../Schems/whitelist.js")
const date = require("../Schems/date.js")
const { CooldownRs } = require('../config.json')

module.exports.run = async (Client, message, args, Namebot, Color) => {
    await mongo().then(async (mongoose) => {
        try {
            const target = message.mentions.users.first() || message.guild.members.cache.get(args[1])
            if(message.member.roles.cache.some(role => role.name === 'resethwid-bypass') || message.member.roles.cache.some(role => role.name === 'Whitelister')) {
                if(target && message.member.roles.cache.some(role => role.name === 'Whitelister')) {
                    whitelist.find({DiscordId: target.id}, (error, results) => {
                        if(results.length) {
                            whitelist.findOneAndUpdate(
                                {
                                    DiscordId: target.id
                                },
                                {
                                    $set: {
                                        Hwid: "Unknown"
                                    }
                                }, 
                                {
                                    upsert: true
                                }, 
                            (error, results) => {
                                if(error) throw error
                                const Embed = new MessageEmbed()
                                .setColor(Color)
                                .setDescription('**'+Namebot+'**')
                                .addField('Message', "<@!"+target.id+">" + " HWID has been reseted", true)
                                message.channel.send(Embed)
                            })
                        } else {
                            const Embed = new MessageEmbed()
                            .setColor(Color)
                            .setDescription('**'+Namebot+'**')
                            .addField('Message', "<@!"+target.id+">" + " is not Whitelisted", true)
                            message.channel.send(Embed)
                        }
                    })
                } else if(target && !message.member.roles.cache.some(role => role.name === 'whitelist-access')) {
                    const Embed = new MessageEmbed()
                    .setColor(Color)
                    .setDescription('**'+Namebot+'**')
                    .addField('Message', "You don't have permission", true)
                    message.channel.send(Embed)
                } else {
                    const userid = message.author.id
                    whitelist.find({DiscordId: userid}, (error, results) => {
                        if(results.length) {
                            whitelist.findOneAndUpdate(
                                {
                                    DiscordId: userid
                                },
                                {
                                    $set: {
                                        Hwid: "Unknown"
                                    }
                                }, 
                            (error, results) => {
                                if(error) throw error
                                const Embed = new MessageEmbed()
                                .setColor(Color)
                                .setDescription('**'+Namebot+'**')
                                .addField('Message', "Your HWID has been reseted", true)
                                message.channel.send(Embed)
                            })
                        } else {
                            const Embed = new MessageEmbed()
                            .setColor(Color)
                            .setDescription('**'+Namebot+'**')
                            .addField('Message', "You don't have permission", true)
                            message.channel.send(Embed)
                        }
                    })
                }
            } else {
                const userid = message.author.id
                const datenow = Date.now()
                whitelist.find({DiscordId: userid}, async (asd, xyz) => {
                    if(xyz.length) {
                        date.find({DiscordId: userid}, async (a, bbd) => {
                            if(bbd.length) {
                                if(bbd[0].Reset === true || bbd[0].Reset === "true") {
                                    var CooldownDay = CooldownRs
                                    if (message.member.roles.cache.some(role => role.name === 'Booster')) {
                                        CooldownDay = 2
                                    }
                                    date.findOneAndUpdate({DiscordId: userid}, {$set : {Time: datenow, Ngay: CooldownDay, Reset: "false"}}, {new: true, upsert: true}, async (aa, bb) => {
                                        if(aa) throw aa
                                        whitelist.findOneAndUpdate(
                                            {
                                                DiscordId: userid
                                            },
                                            {
                                                $set: {
                                                    Hwid: "Unknown"
                                                }
                                            }, 
                                        (error, results) => {
                                            if(error) throw error
                                            const Embed = new MessageEmbed()
                                            .setColor(Color)
                                            .setDescription('**'+Namebot+'**')
                                            .addField('Message', "Your HWID has been reseted", true)
                                            message.channel.send(Embed)
                                        })
                                    })
                                } else {
                                    function component(x, v) {
                                        return Math.floor(x / v);
                                    }
                                    var a = Math.floor(Date.now())
                                    var b = new Date(Number(bbd[0].Time) + 1000 * 60 * 60 * 24 * bbd[0].Ngay) - a
                                    b /= 1000
                                    b--
                                    const d = component(b, 24 * 60 * 60),
                                    h = component(b, 60 * 60) % 24,
                                    m = component(b, 60) % 60,
                                    s = component(b, 1) % 60;
                                    const Embed = new MessageEmbed()
                                    .setColor(Color)
                                    .setDescription('**'+Namebot+'**')
                                    .addField('Message', `Reset HWID still in cooldown ${d}d ${h}h ${m}m ${s}s`, true)
                                    message.channel.send(Embed)
                                }
                            } else {
                                var CooldownDay = CooldownRs
                                if (message.member.roles.cache.some(role => role.name === 'Booster')) {
                                    CooldownDay = 2
                                }
                                date.findOneAndUpdate({DiscordId: userid}, {$set : {Time: datenow, Ngay: CooldownDay}}, {new: true, upsert: true}, async (aaa, bbb) => {
                                    if(aaa) throw aaa
                                    whitelist.findOneAndUpdate(
                                        {
                                            DiscordId: userid
                                        },
                                        {
                                            $set: {
                                                Hwid: "Unknown"
                                            }
                                        }, 
                                    (error, results) => {
                                        if(error) throw error
                                        const Embed = new MessageEmbed()
                                        .setColor(Color)
                                        .setDescription('**'+Namebot+'**')
                                        .addField('Message', "Your HWID has been reseted", true)
                                        message.channel.send(Embed)
                                    })
                                })
                            }
                        })
                    } else {
                        const Embed = new MessageEmbed()
                        .setColor(Color)
                        .setDescription('**'+Namebot+'**')
                        .addField('Message', "You don't have permission", true)
                        message.channel.send(Embed)
                    }
                })
            }
        } catch(e) {
            console.log(e)
        }
    })
    
}

module.exports.help = {
    name: ["resethwid", "rehwid"]
}
