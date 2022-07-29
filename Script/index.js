const Express = require("express")
const Router  = Express.Router()

function findhwid(headers) {
    var hwidTypes = ["syn-fingerprint", "fingerprint", "user-agent"]
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

//Router.get("/", (req, res) => {
//    res.sendFile(__dirname + "/c.lua")
//})

Router.get("/", (req, res) => {
    var game
    var Hwid = findhwid(req.headers)
    var id = req.headers['roblox-place-id']
    try {
      if(id == 4520749081) { // KL 1
        game = "KingLegacy" // name game = name folder script
      } else if(id == 4520749081) {
        game = "asdsad"
      } else {
        game = "gamenotsupport"
      }
      if(Hwid.search("Roblox/WinInet") != -1) {
         res.sendFile(__dirname + "/KhoScript/"+game+".lua")
      } else {
         res.send('print("non:))")')
      }
    } catch(e) {
      res.send("game.Players.LocalPlayer.Kick('[Sea Hub Premium] Your Exploit is not supported')")
    }
})

module.exports = Router