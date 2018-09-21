import { createItem } from 'stash-it';

const items = {};

const MemoryAdapter = () => {
    return {
        buildKey(key) {
            return Promise.resolve(key);
        },

        setItem(key, value, extra = {}) {
            const item = createItem(key, value, extra);

            items[key] = item;

            return Promise.resolve(item);
        },

        getItem(key) {
            return Promise.resolve(items[key]);
        },

        addExtra(key, extra) {
            return this.getItem(key).then((item) => {
                if (!item) {
                    return undefined;
                }

                const currentExtra = item.extra;
                const combinedExtra = Object.assign({}, currentExtra, extra);

                return this.setItem(key, item.value, combinedExtra).then((newItem) => newItem.extra);
            });
        },

        setExtra(key, extra) {
            return this.getItem(key).then((item) => {
                if (!item) {
                    return undefined;
                }

                return this.setItem(key, item.value, extra).then((newItem) => newItem.extra);
            });
        },

        getExtra(key) {
            const item = items[key];
            const result = item ? item.extra : undefined;

            return Promise.resolve(result);
        },

        hasItem(key) {
            return Promise.resolve(items.hasOwnProperty(key));
        },

        removeItem(key) {
            return this.hasItem(key).then((result) => {
                return Boolean(result && delete items[key]);
            });
        }
    };
};

export default MemoryAdapter;
