import fs from 'fs'

import logger from './utility/logger.js'
import settings from '../settings.js'

async function initService(exports, context) {
    let initFunction
    if (typeof(exports) === 'function') {
        if (exports.prototype.constructor === exports) {
            return
        }
        initFunction = exports
    } else if (typeof(exports) === 'object') {
        initFunction = exports.init
    }
    if (initFunction) {
        const isAsync = initFunction.constructor.name === "AsyncFunction"
        if (isAsync) {
            await initFunction(context)
        } else {
            initFunction(context)
        }
    }
}

async function scanDirectory(dir, context) {
    dir = dir || ''

    const files = await fs.promises.readdir("./src/services/"+dir, { withFileTypes: true })

    const scripts = Object.keys(settings.scripts)
    for (let i = 0; i < files.length; i++) {
        if (files[i].isDirectory()) {
            await scanDirectory(files[i].name+'/', context)
            continue
        }
        const fileName = files[i].name.replaceAll('.js', '')
        if (fileName == 'ServiceBootstrap') {
            continue
        }
        if (settings.scripts[fileName] == undefined || settings.scripts[fileName]) {
            const filePath = "./"+dir+fileName+'.js'
            const exports = (await import(filePath)).default
            initService(exports, context)
        }
    }
}

export default async function(context) {
    if (settings.debug.servicesEnabled) {
        await scanDirectory(null, context)
        logger.info('Services successfully booted')
    }
}