const discord = require("discord.js")
const express = require("express")
const fs = require("fs")
const path = require("path")
const request = require("request")
const bodyPas = require("body-parser")
const mongo = require("./mongo")
const {Token, Namebot, Color, Prefix} = require("./config.json")

const Client = new discord.Client({ ws: { intents: new discord.Intents(discord.Intents.ALL) }})
const app = express()

app.use(bodyPas.urlencoded({extended : true}))
app.use(bodyPas.json())
app.use(express.static("views"))

Client.command = new discord.Collection()
module.exports.Client = Client

fs.readdir('./commands/', (err, files) => {
    if(err) console.log(err)
    let jsfile = files.filter(f => f.split('.').pop() === 'js')
  
    jsfile.forEach((f, i) => {
        let props = require('./commands/'+ f)
        const alias = props.help.name
        for(let i=0;i<alias.length;i++){
            Client.command.set(alias[i], props)
        }
    })
})

Client.on("ready", async () => {
    await mongo().then(async (mongoose) => {})
    console.log("Bot Ready")
})

Client.on("message", async message => {
    if (message.author.equals(Client.user)) return
    if (!message.content.startsWith(Prefix)) return
    const args = message.content.slice(Prefix.length).trim().split(/ +/g)
    const cmd = Client.command.get(message.content.split(/\s+/g)[0].slice(Prefix.length))
  
    if(cmd) {
        cmd.run(Client, message, args, Namebot, Color)
    }
    
})

app.get('/', (req, res) => {
    res.send("index")
})

app.get('/headers', (req, res) => {
    res.send(req.headers)
})

app.get('/time', (req, res) => {
    const date = Date.now()

    res.send(date.toString())
})

fs.readdir('./api/', (err, files) => {
    if(err) console.log(err)
        let jsfile = files.filter(f => f.split('.').pop() === 'js')

        jsfile.forEach((f, i) => {
        app.use("/api", require("./api/"+f))
    })
})

app.use("/Script", require("./Script/index.js"))

Client.login(Token)

app.listen(process.env.PORT || 80, async () => {
    console.log("Server Ready")
})