import express from 'express'
import mongoose from 'mongoose'
import http from 'http'
import fs from 'fs'

import settings from "./config/settings.js"

try {
    await mongoose.connect(settings.secret.MongooseUri)
} catch(error) {
    console.log('[ERROR] - ' + error)
}

const app = express()
const server = http.createServer(app)

app.use(express.static("./src/public"))

const apiRoute = await import("./routes/api.js")
const dealsRoute = await import("./routes/deals.js")
const activityRoute = await import("./routes/activity.js")
const homeRoute = await import("./routes/home.js")
const profileRoute = await import("./routes/profile.js")

app.use('/api', apiRoute.default)
app.use('/deals', dealsRoute.default)
app.use('/activity', activityRoute.default)
app.use('/home', homeRoute.default)
app.use('/profile', profileRoute.default)

app.get('/', (req, res) => {
    res.redirect('/home')
})

import ItemWebsocket from "./js/websocket/ItemWebsocket.js"
ItemWebsocket.init(server)

server.listen(settings.port, settings.host, (error) => {
    if (error) {
        console.log(error)
    }
    console.log('Server succesfully started at: http://'+settings.host+':'+settings.port)
})

fs.readdir("./src/js", function(error, files) {
    for (let i = 0; i < files.length; i++) {
        if (settings.scripts.includes(files[i])) {
            let filePath = "./js/"+files[i]
            new Promise(() => {
                import(filePath)
            })
        }
    }
})
