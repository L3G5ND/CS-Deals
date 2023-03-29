import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
    res.sendFile("views/profile.html", {root: './src'})
})

export default router