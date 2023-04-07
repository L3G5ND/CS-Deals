import express from 'express'

import apiController from '../controllers/api.js'

const router = express.Router()

router.get('/item-cache', apiController.itemCache)

router.get('/deal-cache', apiController.dealCache)

export default {
    router: router,
    path: 'api'
}