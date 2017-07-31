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

            return (data[key] = createItem(key, value, namespace, extra));
        },

        getItem(key) {
            return data[key];
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
