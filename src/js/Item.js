import ItemCache from "./ItemCache.js"
import ItemNameParser from "./util/ItemNameParser.js"

export default {
    createItem: function(data) {
        const hashName = data.name

        const info = {
            category: ItemNameParser.getItemCategory(hashName),
            name: ItemNameParser.getItemName(hashName),
            tag: ItemNameParser.getItemTag(hashName),
            itemType: ItemNameParser.getItemType(hashName),
            stickerType: ItemNameParser.getStickerType(hashName),
            event: ItemNameParser.getEvent(hashName),
            hashName: hashName,
            price: data.price,
            float: data.float,
            phase: data.phase,
            id: data.id,
        }

        if (info.category == 'Weapon') {
            if (!info.float) {
                info.float = ItemNameParser.getWeaponQuality(hashName)
            }
        }

        ItemCache.addCache({
            market: data.market,
            info: info
        })
    }
}