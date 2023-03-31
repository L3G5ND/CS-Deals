import express from 'express'
import mongoose from 'mongoose'
import fs from 'fs'

import settings from "./config/settings.js"

try {
    await mongoose.connect(settings.secret.MongooseUri)
} catch(error) {
    console.log('[ERROR] - ' + error)
}

const app = express()

app.use(express.static("./src/public"))

const apiRoute = await import("./routes/api.js")
const sniperRoute = await import("./routes/sniper.js")
const homeRoute = await import("./routes/home.js")
const profileRoute = await import("./routes/profile.js")

app.use('/api', apiRoute.default)
app.use('/sniper', sniperRoute.default)
app.use('/home', homeRoute.default)
app.use('/profile', profileRoute.default)

app.get('/', (req, res) => {
    res.redirect('/home')
})

app.listen(settings.port, settings.host, (error) => {
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
