import express from 'express'
import mongoose from 'mongoose'
import http from 'http'

import logger from './services/utility/logger.js'
import settings from './settings.js'
import RoutesBootstrap from './routes/RoutesBootstrap.js'
import ServiceBootstrap from './services/ServiceBootstrap.js'

try {
    await mongoose.connect(settings.secret.mongodbUrl)
    logger.info('Mongoose successfully connected')
} catch(error) {
    logger.error('Mongoose failed to connect: '+error)
}

const app = express()
const server = http.createServer(app)

app.set('views', './src/views')
app.set('view engine', 'ejs')
app.use(express.static("./src/public"))

await RoutesBootstrap(app)
await ServiceBootstrap({
    server: server,
})

server.listen(settings.port, settings.host, (error) => {
    if (error) {
        console.log(error)
    }
    console.log('Server succesfully started at: http://'+settings.host+':'+settings.port)
})
