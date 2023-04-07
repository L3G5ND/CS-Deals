import fs from 'fs'

import logger from '../services/utility/logger.js'

export default async function(app) {
    app.get('/', (req, res) => {
        res.redirect('/home')
    })

    const files = await fs.promises.readdir("./src/routes")
    for (let i = 0; i < files.length; i++) {
        const fileName = files[i].replaceAll('.js', '')
        if (fileName == 'RoutesBootstrap') {
            continue
        }
        const filePath = "./"+fileName+'.js'
        const route = (await import(filePath)).default
        app.use('/'+route.path, route.router)
    }

    app.use((req, res) => {
        res.render('404')
        return
    })

    logger.info('Routes successfully connected')
}