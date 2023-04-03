import mongoose from 'mongoose'

import settings from '../settings.js'

const Schema = mongoose.Schema

const ItemCacheSchema = new Schema({
    info: {
        type: Object,
        required: true
    }
}, { timestamps: true })

ItemCacheSchema.virtual('createdAtMs').get(function() {
    return this.createdAt.getTime()
})

const exports = {}

for (const key in settings.markets) {
    exports[key.toLowerCase()] = mongoose.model(key+'ItemCache', ItemCacheSchema)
}

export default exports
