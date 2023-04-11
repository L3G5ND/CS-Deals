import SteamUser from 'steam-user'
import csgoCDN from 'csgo-cdn'
import {waitFor} from 'wait-for-event'

import settings from '../../settings.js'

let cdn
if (settings.debug.itemImages) {
    const steamClient = new SteamUser()
    steamClient.logOn({ anonymous: true })
    
    cdn = new csgoCDN(steamClient, { directory: 'csgo-downloads', logLevel: 'error' })
    
    await waitFor('ready', cdn)
}


const itemCategories = [
    'Case',
    'Weapon',
    'Gloves',
    'Key',
    'Sticker Capsule',
    'Sticker',
    'Autograph Capsule',
    'Graffiti',
    'Graffiti Box',
    'Music Kit',
    'Patch Pack',
    'Patch',
    'Pin',
    'Name Tag',
    'Storage Unit',
    'Swap Tool',
    'Souvenir Package',
    'Viewer Pass',
    'Character',
]

const itemTags = ['★', 'StatTrak™', 'Souvenir']

const floatQualities = [
    'Factory New',
    'Minimal Wear',
    'Field-Tested',
    'Well-Worn',
    'Battle-Scarred'
]

const qualityAbbreviations = {
    'Factory New': 'FN',
    'Minimal Wear': 'MW',
    'Field-Tested': 'FT',
    'Well-Worn': 'WW',
    'Battle-Scarred': 'BS',
}

function qualityToAbbreviation(quality) {
    for (const key in qualityAbbreviations) {
        if (key == quality) {
            return qualityAbbreviations[key]
        }
    }
}

function abbreviationToQuality(abbreviation) {
    for (const key in qualityAbbreviations) {
        if (qualityAbbreviations[key] == abbreviation) {
            return key
        }
    }
}

function floatToQuality(float) {
    if (float <= .07) {
        return 'Factory New'
    } else if (float <= .15) {
        return 'Minimal Wear'
    } else if (float <= .38) {
        return 'Field-Tested'
    } else if (float <= .45) {
        return 'Well-Worn'
    } else if (float <= 1) {
        return 'Battle-Scarred'
    }
}

function getLinkName(hashName) {
    hashName = hashName.replace(/[^a-zA-Z0-9- ]/g, '')
    hashName = hashName.trim().replace(/\s+/g, '-')
    hashName = hashName.toLowerCase()
    return hashName
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
    if (itemCategory == 'Weapon' || itemCategory == 'Gloves') {
        const tag = getItemTag(hashName)
        const pipePos = hashName.indexOf('|')
        if (pipePos) {
            if (tag) {
                return hashName.substring(tag.length+1, pipePos-1)
            } else {
                return hashName.substring(0, pipePos-1)
            }
        }
    } else {
        return itemCategory
    }
}

function getItemName(hashName) {
    const itemCategory = getItemCategory(hashName)
    if (itemCategory == 'Weapon') {
        return hashName.substring(hashName.indexOf('|')+2, hashName.indexOf('(')-1)
    } else if (itemCategory == 'Gloves') {
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
        const event = getEvent(hashName)
        const searchStart = hashName.indexOf('|')+2
        if (event) {
            return hashName.substring(searchStart, hashName.indexOf('|', searchStart)-1)
        } else {
            return hashName.substring(searchStart)
        }
        
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

function getImage(hashName, phase) {
    if (settings.debug.itemImages) {
        const cdnPhase = cdn.phase[phase]
        return cdn.getItemNameURL(hashName, cdnPhase)
    }
    return ''
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
    if (itemCategory == 'Weapon' || itemCategory == 'Gloves') {
        return qualityToAbbreviation(hashName.substring(hashName.indexOf('(')+1, hashName.indexOf(')')))
    }
    return null
}

function getWeaponPhase(hashName) {
    const itemCategory = getItemCategory(hashName)
    if (itemCategory == 'Weapon' || itemCategory == 'Gloves') {
        return hashName.substring(hashName.indexOf(') - ')+4)
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

export default {
    ItemCategories: itemCategories,
    ItemTags: itemTags,
    FloatQualities: floatQualities,
    QualityAbbreviations: qualityAbbreviations,

    qualityToAbbreviation: qualityToAbbreviation,
    abbreviationToQuality: abbreviationToQuality,
    floatToQuality: floatToQuality,

    getLinkName: getLinkName,
    getItemCategory: getItemCategory,
    getItemTag: getItemTag,
    getItemType: getItemType,
    getItemName: getItemName,
    getImage: getImage,
    getStickerType: getStickerType,
    getWeaponQuality: getWeaponQuality,
    getWeaponPhase: getWeaponPhase,
    getEvent: getEvent,
}