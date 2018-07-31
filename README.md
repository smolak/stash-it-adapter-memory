![logo-stash-it-color-dark 2x](https://user-images.githubusercontent.com/1819138/30385483-99fd209c-98a7-11e7-85e2-595791d8d894.png)

# stash-it-adapter-memory

[![build status](https://img.shields.io/travis/smolak/stash-it-adapter-memory/master.svg?style=flat-square)](https://travis-ci.org/smolak/stash-it-adapter-memory)
[![Coverage Status](https://coveralls.io/repos/github/smolak/stash-it-adapter-memory/badge.svg?branch=master)](https://coveralls.io/github/smolak/stash-it-adapter-memory)

Memory adapter for [stash-it](https://www.npmjs.com/package/stash-it).

It's build in **ES6** so if you need to run it in an older environment,
you will need to transpile it.

## Installation

```sh
npm i stash-it-adapter-memory --save
```

## Usage

```javascript
import { createCache } from 'stash-it';
import createMemoryAdapter from 'stash-it-adapter-memory';

const adapter = createMemoryAdapter();
const cache = createCache(adapter);
```

And that's it. You are ready to go.

For available methods, check [adapters section in stash-it](https://jaceks.gitbooks.io/stash-it/content/advanced-usage/adapters/methods.html) (all adapters have the same API).

### Heads-up!

Any instance of cache will have access to all items stored in memory,
regardles of which cache instance was used. This is because all of the
adapters are to behave in the same manner, e.g. connecting to the very
same instance of redis / mongo / ... will grant access to the very same
items stored there. So should this adapter.

Have a look:

```javascript
// file1.js - executed BEFORE
import { createCache } from 'stash-it';
import createMemoryAdapter from 'stash-it-adapter-memory';

const adapter = createMemoryAdapter();
const cache1 = createCache(adapter);

cache1.setItem('key', 'value');


// file2.js - executed AFTER
import { createCache } from 'stash-it';
import createMemoryAdapter from 'stash-it-adapter-memory';

const adapter = createMemoryAdapter();
const cache2 = createCache(adapter);

cache2.hasItem('key'); // true
```

And that goes for all of the methods.

#### How to bypass this (if needed)?

The suggested way is to use a plugin with hook for `preBuildKey` event.
This plugin should prefix / suffix the key being passed to the event
handler. When a new key is built using the prefix / suffix, it will be
then used to set / get item from persistance to which adapter gvies
access to.

For more information on how hooks / plugins work, checkout
[stash-it's docs](https://stash-it.gitbook.io/stash-it/).
