import fs from 'fs'
import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
    res.sendFile("views/home.html", {root: './'})
})

export default router