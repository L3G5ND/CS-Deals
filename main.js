import express from 'express'
import mongoose from 'mongoose'
import fs from 'fs'

import settings from "./settings.js"

const app = express()

app.use(express.static("./public"))

import sniperRouter from "./routes/sniper.js"
import homeRouter from "./routes/home.js"
import profileRouter from "./routes/profile.js"

app.use('/sniper', sniperRouter)
app.use('/home', homeRouter)
app.use('/profile', profileRouter)

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

fs.readdir("./js", function(error, files) {
    for (let i = 0; i < files.length; i++) {
        if (settings.scripts.includes(files[i])) {
            let filePath = "./js/"+files[i]
            new Promise(() => {
                import(filePath)
            })   
        }
    }
})
