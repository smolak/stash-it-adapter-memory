import { createItem } from 'stash-it';

function validateNamespace(namespace) {
    if (typeof namespace !== 'string') {
        throw new Error('`namespace` must be a string.');
    }

    if (false === /^[A-Za-z0-9_-]+$/i.test(namespace)) {
        throw Error('`namespace` can contain only letters, numbers, `_` or `-`.');
    }
}

function validateKey(key) {
    if (typeof key !== 'string') {
        throw new Error('`key` must be a string.');
    }

    if (false === /^[A-Za-z0-9._-]+$/i.test(key)) {
        throw Error('`key` can contain only letters, numbers, `_`, `.` or `-`.');
    }
}

function validateExtra(extra) {
    if (typeof extra !== 'object' || extra === null || Array.isArray(extra)) {
        throw new Error('`extra` must be an object.');
    }
}

const data = {};

const MemoryAdapter = ({ namespace }) => {
    validateNamespace(namespace);

    return {
        buildKey(key) {
            return `${namespace}.${key}`;
        },

        setItem(key, value, extra = {}) {
            validateKey(key);

            return (data[key] = createItem(key, value, namespace, extra));
        },

        getItem(key) {
            return data[key];
        },

        addExtra(key, extra) {
            validateExtra(extra);

            const item = this.getItem(key);

            if (!item) {
                return undefined;
            }

            const currentExtra = item.extra;
            const combinedExtra = Object.assign({}, currentExtra, extra);
            const newItem = this.setItem(key, item.value, combinedExtra);

            return newItem.extra;
        },

        setExtra(key, extra) {
            validateExtra(extra);

            const item = this.getItem(key);

            if (!item) {
                return undefined;
            }

            const newItem = this.setItem(key, item.value, extra);

            return newItem.extra;
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
