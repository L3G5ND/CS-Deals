import mongoose from 'mongoose'

import settings from '../settings.js'

const Schema = mongoose.Schema

const ItemCacheSchema = new Schema({
    item: {
        type: Object,
        required: true
    }
}, { timestamps: true })

ItemCacheSchema.virtual('createdAtMs').get(function() {
    return this.createdAt.getTime()
})

const normal = {}
for (const key in settings.markets) {
    normal[key.toLowerCase()] = mongoose.model(key+'ItemCache', ItemCacheSchema)
}

const deal = {}
for (const key in settings.markets) {
    deal[key.toLowerCase()] = mongoose.model(key+'DealCache', ItemCacheSchema)
}

export default {
    normal: normal,
    deal: deal
}
