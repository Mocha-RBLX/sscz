const Express = require("express")
const crypto = require('crypto');
const request = require("request")
const mongo = require("../mongo.js")
const {MessageEmbed} = require("discord.js")
const Client = require("../index").Client
const Router = Express.Router()
const whitelist = require("../Schems/whitelist.js")

function fortable(table, func) {
    for (var p in table) {
        if (table.hasOwnProperty(p)) {
            func(p, table[p])
        }
    }
}
function findhwid(headers) {
    var hwidTypes = ["syn-fingerprint", "fingerprint"]
    var count = 0
    var hwid = null
    hwidTypes.forEach(header => {
        if (headers[header]) {
          count = count + 1
          hwid = headers[header]
        }
    })
    if (count > 1) {
        hwid = null
    }
    return hwid
}

function uniformRNG(a, b) {
    let a1 = 48718057,
        a2 = 58305628

    let b1 = 108466472,
        b2 = 1090878788885

    let x1 = a,
        x2 = b

    let r1 = (x2 * a2);
    let r2 = (x1 * a2 + x2 * a1) % b1
    r2 = (r2 * b1 + r2) % b2

    x1 = Math.floor(r2 / b1)

    return Math.floor(x1*b1)
}

var Cyber = [];
var hexNums = [];

for (i = 0; i <= 9; i++) {
    hexNums[i] = i.toString();
}

hexNums[10] = "Q";
hexNums[11] = "N";
hexNums[12] = "A";
hexNums[13] = "C";
hexNums[14] = "R";
hexNums[15] = "G";

var decNums = [];

for (i = 0; i <= 9; i++) {
    decNums[i.toString()] = i;
}

decNums["Q"] = 10;
decNums["N"] = 11;
decNums["A"] = 12;
decNums["C"] = 13;
decNums["R"] = 14;
decNums["G"] = 15;

Cyber.decToHex = function(num) {
    var output = "";

    while (num > 0) {
        var remainder = num % 16;

        output = hexNums[remainder] + output

        num = Math.floor(num / 16)
    }

    return output
}
Cyber.hexToDec = function(num) {
    var output = 0
    var max = num.length;
    for (i = 1; i <= max; i++) {
        var decnum = decNums[num.substring(i - 1, i)]
        output = output + decnum * (Math.pow(16, (max - (i))))
    }
    return output
}
Cyber.GetUTF8Table = function() {
    var TableUTF8 = []
    var i = 1
    do {
        TableUTF8[i] = [String.fromCharCode(i), i];
        i = i + 1;
    }
    while (i <= 127)
    return TableUTF8
}
Cyber.UTF8Table = Cyber.GetUTF8Table()
Cyber.GetUTF8Number = function(char) {
    var UTF8Table = Cyber.UTF8Table
    if (char.length > 1) {
        console.log("The input cannot be higher than one character")
    } else if (char.length < 1) {
        console.log("The input cannot be lower than one character")
    } else {
        for (const [i, value] of UTF8Table.entries()) {
            if (i > 0)
            {
                if (char == value[0]) {
                    return value[1];
                }
            }
        }
    }
}

Cyber.Encrypt = function(text, key) {
  var TextCode = 0
  var KeyCode = 0
  var Encrypted = ""
  var TextCodes = [];

  for(a = 1 ; a <= text.length;a++) {
    TextCodes[a] = [Cyber.GetUTF8Number(text.substring(a-1,a))];
  }
  for(b = 1 ; b <= key.length;b++) {
    KeyCode = (KeyCode + Cyber.GetUTF8Number(key.substring(b-1,b))) 
  }
  for (const [i, value] of TextCodes.entries()) {
    if (i > 0) {
      if (i == 1) {
        Encrypted = Encrypted + Cyber.decToHex(value * KeyCode)
      } else {
        Encrypted = Encrypted + "-" + Cyber.decToHex(value * KeyCode)
      }
    }
  }
  return Encrypted
}

//-- render web

Router.get('/:Random/:Key', async (req, res) => {
    try {
        const Hwid = findhwid(req.headers)
        if(Hwid !== null) {
            await mongo().then(async (mongoose) => {
                const key = req.params.Key
                const random = req.query.white
                if(key.length == 15 && !random) {
                    const cac = crypto.createHash('sha256').update(Math.floor(Date.now() / 10000).toString().substr(0, Math.floor(Date.now() / 10000).toString().length - 2) + "v1VyGuetGQvf").digest('hex');
                    res.send(Buffer.from(`blue of white ${key}${cac}`).toString("base64"))
                    return
                }

                let exploit = "None"
                const Ip = "asdasd" //req.headers["x-forwarded-for"].split(",")[0]
                const de = Buffer.from(key, 'base64').toString('ascii')

                if(req.params.Random.length != 36 && req.params.Random.search("-") != -1) {
                    return
                }

                fortable(req.headers, function(i, v) {
                    if(i == "syn-fingerprint") {
                        exploit = "Synapse X"
                    } else if(i == "sentinel-fingerprint") {
                        exploit = "Sentinel"
                    } else if(i == "proto-user-identifier") {
                        exploit = "ProtoSmasher"
                    } else if(i == "krnl-hwid") {
                        exploit = "Krnl"
                    } else if(i == "exploit-guid") {
                        exploit = "Sirhurt"
                    }
                })

                if(de.length == 79 || random) {
                    const keyc = de.substr(0, 15)
                    whitelist.find({UserKey: keyc}, async (err, results) => {
                        if(err) throw err
                        if(results.length) {
                            var ScanKey = (keyc === results[0].UserKey)
                            var ScanHwid = (results[0].Hwid === Hwid) || (results[0].Hwid === "Unknown")
                            if(ScanKey && ScanHwid) {
                                var DataKey = results[0].UserKey
                                var DataHwid = results[0].Hwid
                                var discord = results[0].DiscordId
                                var e = DataHwid
                                if(DataHwid !== "Unknown") {
                                    var b = DataHwid.match(/-?\d*\.?\d+/g)
                                    var c = b.length / 2 + 5 - 3 + 1
                                    var d = b[Math.floor(c) - 1]
                                    var n = 0
                                    var t = d.length
                                    for(i=t-t+3; i < d.length; i++) {
                                        n++
                                    }
                                    var p = d.substring(n)
                                    var e = DataHwid.replace(d, uniformRNG(p, c))
                                }
                                var Tokens = Buffer.from(`${DataKey}${Hwid}${random}${crypto.createHash('sha256').update(Math.floor(Date.now() / 10000).toString().substr(0, Math.floor(Date.now() / 10000).toString().length - 2) + "jlQHqLOL4gXM").digest('hex')}`).toString("base64")
                                res.send(Cyber.Encrypt(`{"Key":"${DataKey}","Hwid":"${e}","Token":"${Tokens}"}`, DataKey))
                                if(DataHwid === "Unknown") {
                                    whitelist.findOneAndUpdate({UserKey: DataKey}, {$set: { Hwid: Hwid, IP : Ip }}, {upsert: true}, async (error, results) => {
                                        if(error) throw error
                                    })
                                } else {
                                }
                            } else {
                                res.send(JSON.stringify({
                                    Message : "Invalid Hwid"
                                }))
                            }
                        } else {
                            res.send(JSON.stringify({
                                Message : "Invalid Key"
                            }))
                        }
                    })
                } else {
                    res.status(404).send("ERROR")
                }
            })
        } else {
            res.status(404).send("ERROR")
        }
    } catch(e) {
        console.log(e)
        res.status(404).send("ERROR")
    }
})

Router.get("/:reason", async (req, res) => {
    let exploit = "None"
      fortable(req.headers, function(i, v) {
        if(i == "syn-fingerprint") {
            exploit = "Synapse X"
        } else if(i == "sentinel-fingerprint") {
            exploit = "Sentinel"
        } else if(i == "proto-user-identifier") {
            exploit = "ProtoSmasher"
        } else if(i == "krnl-hwid") {
            exploit = "Krnl"
        } else if(i == "exploit-guid") {
            exploit = "Sirhurt"
        }
    })
    const anti = req.params.reason
    const white = req.query.white
    const Hwid = findhwid(req.headers)
    try {
        if(Hwid !== null) {
            if(anti && white) {
                res.send(Hwid)
            }
        } else {
            res.send("ERROR")
        }
    } catch(e) {
        console.log(e)
        res.send("ERROR")
    }
})
module.exports = Router