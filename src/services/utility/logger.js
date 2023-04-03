import winston from "winston"

import settings from "../../settings.js"

export default winston.createLogger({
    level: settings.logLevel,
    transports: [
        new winston.transports.Console({
            colorize: true,
            format: winston.format.printf((info) => {
                return `[Server] ${info.level} - ${info.message}`;
            })
        })
    ]
}) 