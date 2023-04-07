import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import http from 'http'

import logger from './services/utility/logger.js'
import settings from './settings.js'
import RoutesBootstrap from './routes/RoutesBootstrap.js'
import ServiceBootstrap from './services/ServiceBootstrap.js'
import AuthMiddleware from './middleware/auth.js'

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
app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("./src/public"))

app.use(AuthMiddleware)

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
