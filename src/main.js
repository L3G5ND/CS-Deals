import express from 'express'
import mongoose from 'mongoose'
import fs from 'fs'

import settings from "./config/settings.js"

const app = express()

app.use(express.static("./src/public"))

import apiRoute from "./routes/api.js"
import sniperRoute from "./routes/sniper.js"
import homeRoute from "./routes/home.js"
import profileRoute from "./routes/profile.js"

app.use('/api', apiRoute)
app.use('/sniper', sniperRoute)
app.use('/home', homeRoute)
app.use('/profile', profileRoute)

app.get('/', (req, res) => {
    res.redirect('/home')
})

app.listen(settings.port, settings.host, (error) => {
    if (error) {
        console.log(error)
    }
    console.log('Server succesfully started at: http://'+settings.host+':'+settings.port)
})

async function connectMongoose() {
    try {
        await mongoose.connect(settings.secret.MongooseUri)
    } catch(error) {
        console.log('[ERROR] - ' + error)
    }
}
await connectMongoose()

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
