import { expect } from 'chai';
import { createItem } from 'stash-it';
import {
    BAR_KEY,
    BAR_VALUE,
    FOO_EXTRA,
    FOO_KEY,
    FOO_VALUE,
    NONEXISTENT_KEY
} from 'stash-it-test-helpers';

import createMemoryAdapter from '../../../src/index';

describe('MemoryAdapter', () => {
    beforeEach(() => {
        const memoryAdapter = createMemoryAdapter();

        memoryAdapter.removeItem(FOO_KEY);
        memoryAdapter.removeItem(BAR_KEY);
    });

    describe('buildKey', () => {
        it('should return built key', () => {
            const memoryAdapter = createMemoryAdapter();

            expect(memoryAdapter.buildKey('key')).to.eventually.equal('key');
        });
    });

    it('should store data between different adapter instances', () => {
        const adapter1 = createMemoryAdapter();

        adapter1.setItem(FOO_KEY, FOO_VALUE);

        const expectedItem1 = createItem(FOO_KEY, FOO_VALUE);

        // yes, it needs to be created AFTER item1 was set
        const adapter2 = createMemoryAdapter();

        adapter2.setItem(BAR_KEY, BAR_VALUE);

        const expectedItem2 = createItem(BAR_KEY, BAR_VALUE);

        const item1adapter1 = adapter1.getItem(FOO_KEY);
        const item1adapter2 = adapter2.getItem(FOO_KEY);

        const item2adapter1 = adapter1.getItem(BAR_KEY);
        const item2adapter2 = adapter2.getItem(BAR_KEY);

        return Promise.all([
            expect(item1adapter1).to.eventually.deep.equal(expectedItem1),
            expect(item1adapter2).to.eventually.deep.equal(expectedItem1),
            expect(item2adapter1).to.eventually.deep.equal(expectedItem2),
            expect(item2adapter2).to.eventually.deep.equal(expectedItem2)
        ]);
    });

    describe('setItem', () => {
        it('should resolve with an item', () => {
            const adapter = createMemoryAdapter();
            const expectedItem = createItem(FOO_KEY, FOO_VALUE);

            expect(adapter.setItem(FOO_KEY, FOO_VALUE)).to.eventually.deep.eq(expectedItem);
        });

        it('should store an item', () => {
            const adapter = createMemoryAdapter();
            const expectedItem = createItem(FOO_KEY, FOO_VALUE);

            adapter.setItem(FOO_KEY, FOO_VALUE).then(() => {
                expect(adapter.getItem(FOO_KEY)).to.eventually.deep.equal(expectedItem);
            });
        });
    });

    describe('getItem', () => {
        context('when item exists', () => {
            it('should resolve with that item', () => {
                const adapter = createMemoryAdapter();
                const expectedItem = createItem(FOO_KEY, FOO_VALUE);

                adapter.setItem(FOO_KEY, FOO_VALUE);
                expect(adapter.getItem(FOO_KEY)).to.eventually.deep.equal(expectedItem);
            });
        });

        context('when item does not exist', () => {
            it('should resolve with undefined', () => {
                const adapter = createMemoryAdapter();

                expect(adapter.getItem(NONEXISTENT_KEY)).to.eventually.equal(undefined);
            });
        });
    });

    describe('addExtra', () => {
        context('when item does not exist', () => {
            it('should resolve with undefined', () => {
                const adapter = createMemoryAdapter();

                expect(adapter.addExtra(NONEXISTENT_KEY, FOO_EXTRA)).to.eventually.equal(undefined);
            });
        });

        it('should add extra to existing one', () => {
            const adapter = createMemoryAdapter();

            adapter.setItem(FOO_KEY, FOO_VALUE, FOO_EXTRA).then(() => {
                const addedExtra = { something: 'else' };
                const expectedCombinedExtra = Object.assign({}, FOO_EXTRA, addedExtra);

                adapter.addExtra(FOO_KEY, addedExtra).then(() => {
                    expect(adapter.getExtra(FOO_KEY)).to.eventually.deep.equal(expectedCombinedExtra);
                });
            });
        });

        it('should resolve with combined extra', () => {
            const adapter = createMemoryAdapter();

            adapter.setItem(FOO_KEY, FOO_VALUE, FOO_EXTRA).then(() => {
                const addedExtra = { something: 'else' };
                const expectedCombinedExtra = Object.assign({}, FOO_EXTRA, addedExtra);

                expect(adapter.addExtra(FOO_KEY, addedExtra)).to.eventually.deep.equal(expectedCombinedExtra);
            });
        });

        context('when added extra contains properties of existing extra', () => {
            it('should overwrite existing properties with new ones', (done) => {
                const adapter = createMemoryAdapter();
                const extraToSet = Object.assign({}, FOO_EXTRA, { something: 'else' });
                const addedExtra = { something: 'entirely different' };

                adapter.setItem(FOO_KEY, FOO_VALUE, extraToSet).then(() => {
                    adapter.addExtra(FOO_KEY, addedExtra).then((extra) => {
                        const expectedCombinedExtra = Object.assign({}, extraToSet, addedExtra);

                        adapter.getItem(FOO_KEY).then((item) => {
                            expect(extra).to.deep.equal(expectedCombinedExtra);
                            expect(extra).to.deep.equal(item.extra);

                            done();
                        });
                    });
                });
            });
        });
    });

    describe('setExtra', () => {
        context('when item does not exist', () => {
            it('should resolve with undefined', () => {
                const adapter = createMemoryAdapter();

                expect(adapter.setExtra(NONEXISTENT_KEY, FOO_EXTRA)).to.eventually.equal(undefined);
            });
        });

        it('should resolve with extra', () => {
            const adapter = createMemoryAdapter();
            const newExtra = { something: 'else' };

            adapter.setItem(FOO_KEY, FOO_VALUE, FOO_EXTRA);

            expect(adapter.setExtra(FOO_KEY, newExtra)).to.eventually.deep.equal(newExtra);
        });

        it('should store extra', () => {
            const adapter = createMemoryAdapter();
            const newExtra = { something: 'else' };

            adapter.setItem(FOO_KEY, FOO_VALUE, FOO_EXTRA).then(() => {
                adapter.setExtra(FOO_KEY, newExtra).then(() => {
                    expect(adapter.getExtra(FOO_KEY)).to.eventually.deep.equal(newExtra);
                });
            });
        });
    });

    describe('getExtra', () => {
        context('when item exists', () => {
            it('should resolve with extra', () => {
                const adapter = createMemoryAdapter();
                const expectedExtra = { some: 'extra' };

                adapter.setItem(FOO_KEY, FOO_VALUE, { some: 'extra' });

                expect(adapter.getExtra(FOO_KEY)).to.eventually.deep.equal(expectedExtra);
            });
        });

        context('when item does not exist', () => {
            it('should resolve with undefined', () => {
                const adapter = createMemoryAdapter();

                expect(adapter.getExtra(NONEXISTENT_KEY)).to.eventually.equal(undefined);
            });
        });
    });

    describe('hasItem', () => {
        context('when item exists', () => {
            it('should resolve with true', () => {
                const adapter = createMemoryAdapter();

                adapter.setItem(FOO_KEY, FOO_VALUE);

                expect(adapter.hasItem(FOO_KEY)).to.eventually.be.true;
            });
        });

        context('when item does not exist', () => {
            it('should resolve with false', () => {
                const adapter = createMemoryAdapter();

                expect(adapter.hasItem(NONEXISTENT_KEY)).to.eventually.be.false;
            });
        });
    });

    describe('removeItem', () => {
        context('when item exists', () => {
            it('should remove that item', () => {
                const adapter = createMemoryAdapter();

                adapter.setItem(FOO_KEY, FOO_VALUE).then(() => {
                    adapter.removeItem(FOO_KEY).then(() => {
                        expect(adapter.getItem(FOO_KEY)).to.eventually.be.undefined;
                    });
                });
            });

            it('should resolve with true', () => {
                const adapter = createMemoryAdapter();

                adapter.setItem(FOO_KEY, FOO_VALUE);

                expect(adapter.removeItem(FOO_KEY)).to.eventually.be.true;
            });
        });

        context('when item does not exist', () => {
            it('should resolve with false', () => {
                const adapter = createMemoryAdapter();

                expect(adapter.removeItem(NONEXISTENT_KEY)).to.eventually.be.false;
            });
        });
    });
});
