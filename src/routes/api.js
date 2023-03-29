import fs from 'fs'
import express from 'express'
const router = express.Router()

router.get('/item-deals-cache', (req, res) => {
    console.log(req.query.market)
    if (!req.query.market) {
        req.query.market = 'all'
    }
    res.send(req.query.market)
})

router.get('/item-cache', (req, res) => {
    console.log(req.query.market)
    if (!req.query.market) {
        req.query.market = 'all'
    }
    res.send(req.query.market)
})

export default router