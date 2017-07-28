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

const data = {};

const MemoryAdapter = ({ namespace }) => {
    validateNamespace(namespace);

    return {
        buildKey(key) {
            return `${namespace}.${key}`;
        },

        setItem(key, value, extra = {}) {
            validateKey(key);

            const builtKey = this.buildKey(key);

            return (data[builtKey] = createItem(builtKey, value, namespace, extra));
        },

        getItem(key) {
            const itemKey = this.buildKey(key);

            return data[itemKey];
        },

        getExtra(key) {
            const itemKey = this.buildKey(key);

            const item = data[itemKey];

            return item ? item.extra : undefined;
        },

        hasItem(key) {
            return data.hasOwnProperty(this.buildKey(key));
        },

        removeItem(key) {
            const itemKey = this.buildKey(key);

            return Boolean(this.hasItem(key) && delete data[itemKey]);
        }
    };
};

export default MemoryAdapter;
