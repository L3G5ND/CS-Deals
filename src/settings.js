import dotenv from 'dotenv'
dotenv.config()

const settings = {

    host: '127.0.0.1',
    port: process.env.PORT || 3000,

    debug: {
        logLevel: 'debug',
        viewDebug: true,
        servicesEnabled: true,
        itemImages: true,
    },

    secret: {
        mongodbUrl: process.env.MONGODB_URL,
        waxpeerAPIKey: process.env.WAXPEER_API_KEY
    },

    database: {
        maxItemCache: 300,
    },

    scripts: {
        "ItemWebsocket": true,
        "Waxpeer": true,
    },

    markets: {
        'All': true,
        'Waxpeer': true,
    },

    tierInfo: {
        Tier0: {
            maxDeals: -Number.MAX_SAFE_INTEGER,
        },
        Tier1: {
            maxDeals: 20,
        },
        Tier2: {
            maxDeals: 40,
        },
        Tier3: {
            maxDeals: Number.MAX_SAFE_INTEGER,
        },
    }

}

settings.tiers = Object.keys(settings.tierInfo)
settings.defaultTier = settings.tiers[0]

if (settings.debug.viewDebug) {
    settings.debug.servicesEnabled = false
    settings.debug.itemImages = false
}

export default settings
