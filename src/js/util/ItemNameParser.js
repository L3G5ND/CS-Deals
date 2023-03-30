const itemCategories = [
    'Weapon',
    'Key',
    'Case',
    'Sticker Capsule',
    'Sticker',
    'Graffiti',
    'Music Kit',
    'Patch Pack',
    'Patch',
    'Pin',
    'Name Tag',
    'Storage Unit',
    'Swap Tool',
    'Viewer Pass'
]

const itemTags = ['★', 'StatTrak™', 'Souvenir']

const floatQualities = [
    'Factory New',
    'Minimal Wear',
    'Field-Tested',
    'Well-Worn',
    'Battle-Scared'
]

const qualityAbbreviations = {
    'Factory New': 'FN',
    'Minimal Wear': 'MW',
    'Field-Tested': 'FT',
    'Well-Worn': 'WW',
    'Battle-Scared': 'BS',
}

function getItemCategory(hashName) {
    for (let i = 0; i < floatQualities.length; i++) {
        if (hashName.indexOf(floatQualities[i]) != -1) {
            return 'Weapon'
        }
    }
    for (let i = 0; i < itemCategories.length; i++) {
        if (hashName.indexOf(itemCategories[i]) != -1) {
            return itemCategories[i]
        }
    }
    return 'Character'
}

function getItemTag(hashName) {
    for (const tag of itemTags) {
        if (hashName.startsWith(tag)) {
            return tag
        }
    }
    return ''
}

function getItemType(hashName) {
    const itemCategory = getItemCategory(hashName)
    if (itemCategory == 'Weapon') {
        const tag = getItemTag(hashName)
        const pipePos = hashName.indexOf('|')
        if (pipePos) {
            return hashName.substring(tag.length+1, pipePos-1)
        }
    } else {
        return itemCategory
    }
}

function getItemName(hashName) {
    const itemCategory = getItemCategory(hashName)
    if (itemCategory == 'Weapon') {
        return hashName.substring(hashName.indexOf('|')+2, hashName.indexOf('(')-1)
    } else if (itemCategory == 'Sticker') {
        const stickerType = getStickerType(hashName)
        const event = getEvent(hashName)
        const searchStart = hashName.indexOf('|')+2
        if (stickerType == 'Normal') {
            if (event) {
                return hashName.substring(searchStart, hashName.indexOf('|', searchStart)-1)
            } else {
                return hashName.substring(searchStart)
            }
        } else {
            return hashName.substring(searchStart, hashName.indexOf('(')-1)
        }
    } else if (itemCategory == 'Graffiti') {
        const searchStart = hashName.indexOf('|')+2
        return hashName.substring(searchStart, hashName.indexOf('|', searchStart)-1)
    } else if (itemCategory == 'Music Kit') {
        return hashName.substring(hashName.indexOf('|')+2)
    } else if (itemCategory == 'Patch') {
        const searchStart = hashName.indexOf('|')+1
        return hashName.substring(searchStart)
    } else {
        const itemTag = getItemTag(hashName)
        if (itemTag) {
            return hashName.substring(itemTag.length+1)
        }
        return hashName
    }
}

function getStickerType(hashName) {
    const itemCategory = getItemCategory(hashName)
    if (itemCategory == 'Sticker') {
        if (hashName.indexOf('(') != -1) {
            return hashName.substring(hashName.indexOf('(')+1, hashName.indexOf(')'))
        }
        return 'Normal'
    }
    return null
}

function getWeaponQuality(hashName) {
    const itemCategory = getItemCategory(hashName)
    if (itemCategory == 'Weapon') {
        return qualityToAbbreviation(hashName.substring(hashName.indexOf('(')+1, hashName.indexOf(')')))
    }
    return null
}

function getEvent(hashName) {
    const itemCategory = getItemCategory(hashName)
    if (itemCategory == 'Sticker' || itemCategory == 'Graffiti' || itemCategory == 'Patch') {
        const searchStart = hashName.indexOf('|', hashName.indexOf('|')+1)
        if (searchStart != -1) {
            return hashName.substring(searchStart+2)
        }
    }
    return null
}

function qualityToAbbreviation(quality) {
    for (const key in qualityAbbreviations) {
        if (key == quality) {
            return qualityAbbreviations[key]
        }
    }
}

export default {
    ItemCategories: itemCategories,
    ItemTags: itemTags,
    FloatQualities: floatQualities,
    QualityAbbreviations: qualityAbbreviations,

    getItemCategory: getItemCategory,
    getItemTag: getItemTag,
    getItemType: getItemType,
    getItemName: getItemName,
    getStickerType: getStickerType,
    getWeaponQuality: getWeaponQuality,
    getEvent: getEvent,
    qualityToAbbreviation: qualityToAbbreviation,
}