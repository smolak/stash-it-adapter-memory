import { createItem } from 'stash-it';

const data = {};

const MemoryAdapter = () => {
    return {
        buildKey(key) {
            return Promise.resolve(key);
        },

        setItem(key, value, extra = {}) {
            const item = (data[key] = createItem(key, value, extra));

            return Promise.resolve(item);
        },

        getItem(key) {
            return Promise.resolve(data[key]);
        },

        addExtra(key, extra) {
            return this.getItem(key).then((item) => {
                if (!item) {
                    return Promise.resolve(undefined);
                }

                const currentExtra = item.extra;
                const combinedExtra = Object.assign({}, currentExtra, extra);

                return this.setItem(key, item.value, combinedExtra).then((newItem) => newItem.extra);
            });
        },

        setExtra(key, extra) {
            return this.getItem(key).then((item) => {
                if (!item) {
                    return Promise.resolve(undefined);
                }

                return this.setItem(key, item.value, extra).then((newItem) => newItem.extra);
            });
        },

        getExtra(key) {
            const item = data[key];
            const result = item ? item.extra : undefined;

            return Promise.resolve(result);
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
