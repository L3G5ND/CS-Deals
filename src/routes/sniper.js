import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
    res.sendFile("views/sniper.html", {root: './'})
})

router.get('/item/:id', (req, res) => {
    //req.params.id
})

export default router