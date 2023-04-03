import express from 'express'

import apiControllers from '../controllers/api.js'

const router = express.Router()

router.get('/item-cache', apiControllers.itemCache)

router.get('/deal-cache', apiControllers.dealCache)

export default {
    router: router,
    path: 'api'
}