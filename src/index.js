import { createItem } from 'stash-it';

const data = {};

const MemoryAdapter = () => {
    return {
        buildKey(key) {
            return Promise.resolve(key);
        },

        setItem(key, value, extra = {}) {
            return Promise.resolve(data[key] = createItem(key, value, extra));
        },

        getItem(key) {
            return data[key];
        },

        addExtra(key, extra) {
            const item = this.getItem(key);

            if (!item) {
                return Promise.resolve(undefined);
            }

            const currentExtra = item.extra;
            const combinedExtra = Object.assign({}, currentExtra, extra);

            return this.setItem(key, item.value, combinedExtra).then((newItem) => newItem.extra);
        },

        setExtra(key, extra) {
            const item = this.getItem(key);

            if (!item) {
                return Promise.resolve(undefined);
            }

            return this.setItem(key, item.value, extra).then((newItem) => newItem.extra);
        },

        getExtra(key) {
            const item = data[key];

            return item ? item.extra : undefined;
        },

        hasItem(key) {
            return data.hasOwnProperty(key);
        },

        removeItem(key) {
            return Boolean(this.hasItem(key) && delete data[key]);
        }
    };
};

export default MemoryAdapter;
