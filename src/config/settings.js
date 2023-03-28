export default {
    host: '127.0.0.1',
    port: process.env.PORT || 3000,
    devCurrency: "USD",
    maxCache: 3,
    secret: {
        SteamAPIKey: '3974343A4CD560FBB99F4529025FBEEA',
        WaxpeerAPIKey: '2b99cb5d71065f332dd5698a9b094263d73154f5341b79b67c4c7b1f86104ae8',
        CurrencyAPIKey: 'wZmbi2A4p7VdS3r9659Z6v5tMLfxugYgzRLxiXkp',
        MongooseUri: 'mongodb+srv://CSGOUtility:wgZhCt0kmv3bTK5j@csgoutilitydatabase.9eeb1ux.mongodb.net/main?retryWrites=true&w=majority',
    },
    scripts: [
        //"Waxpeer.js",
    ],
}