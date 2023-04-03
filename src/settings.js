import dotenv from 'dotenv'
dotenv.config()

const settings = {

    host: '127.0.0.1',
    port: process.env.PORT || 3000,

    debug: {
        logLevel: 'debug',
        itemImages: true,
    },

    secret: {
        mongodbUrl: process.env.MONGODB_URL,
        waxpeerAPIKey: process.env.WAXPEER_API_KEY
    },

    database: {
        maxItemCache: 800,
    },

    scripts: {
        "ItemWebsocket": true,
        "Waxpeer": true,
    },

    markets: {
        'All': true,
        'Waxpeer': true,
    }

}

export default settings
