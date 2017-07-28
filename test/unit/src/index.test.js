import { expect } from 'chai';
import { createItem } from 'stash-it';
import { FOO_KEY, FOO_VALUE, BAR_KEY, BAR_VALUE, NONEXISTENT_KEY, testKey, testNamespace } from 'stash-it-test-helpers';

import createMemoryAdapter from '../../../src/index';

describe('MemoryAdapter', () => {
    const namespace = 'namespace';
    const defaultOptions = { namespace };

    beforeEach(() => {
        const memoryAdapter = createMemoryAdapter(defaultOptions);

        memoryAdapter.removeItem(FOO_KEY);
        memoryAdapter.removeItem(BAR_KEY);
    });

    describe('namespace validation', () => {
        testNamespace(createMemoryAdapter);
    });

    describe('buildKey', () => {
        it('should return key string composed of passed key and namespace', () => {
            const memoryAdapter = createMemoryAdapter(defaultOptions);

            expect(memoryAdapter.buildKey('key')).to.eq('namespace.key');
        });
    });

    it('should store data between different adapter instances', () => {
        const adapter1 = createMemoryAdapter(defaultOptions);

        adapter1.setItem(FOO_KEY, FOO_VALUE);

        const expectedItem1 = createItem(adapter1.buildKey(FOO_KEY), FOO_VALUE, namespace);

        // yes, it needs to be created AFTER item1 was set
        const adapter2 = createMemoryAdapter(defaultOptions);

        adapter2.setItem(BAR_KEY, BAR_VALUE);

        const expectedItem2 = createItem(adapter2.buildKey(BAR_KEY), BAR_VALUE, namespace);

        const item1adapter1 = adapter1.getItem(FOO_KEY);
        const item1adapter2 = adapter2.getItem(FOO_KEY);

        const item2adapter1 = adapter1.getItem(BAR_KEY);
        const item2adapter2 = adapter2.getItem(BAR_KEY);

        expect(item1adapter1).to.deep.eq(expectedItem1);
        expect(item1adapter2).to.deep.eq(expectedItem1);

        expect(item2adapter1).to.deep.eq(expectedItem2);
        expect(item2adapter2).to.deep.eq(expectedItem2);
    });

    describe('setItem', () => {
        describe('key validation', () => {
            const adapter = createMemoryAdapter(defaultOptions);

            testKey(adapter.setItem);
        });

        describe('extra validation', () => {
            context('when extra contains namespace property', () => {
                it('should throw', () => {
                    const adapter = createMemoryAdapter(defaultOptions);

                    expect(adapter.setItem.bind(adapter, FOO_KEY, FOO_VALUE, { namespace })).to.throw(
                        '`extra` can\'t contain `namespace` property.'
                    );
                });
            });
        });

        it('should store and return item', () => {
            const adapter = createMemoryAdapter(defaultOptions);
            const item = adapter.setItem(FOO_KEY, FOO_VALUE);
            const expectedItem = createItem(adapter.buildKey(FOO_KEY), FOO_VALUE, namespace);

            expect(item).to.deep.eq(expectedItem);
        });
    });

    describe('getItem', () => {
        context('when item exists', () => {
            it('should return that item', () => {
                const adapter = createMemoryAdapter(defaultOptions);

                adapter.setItem(FOO_KEY, FOO_VALUE);

                const item = adapter.getItem(FOO_KEY);
                const expectedItem = createItem(adapter.buildKey(FOO_KEY), FOO_VALUE, namespace);

                expect(item).to.deep.eq(expectedItem);
            });
        });

        context('when item does not exist', () => {
            it('should return undefined', () => {
                const adapter = createMemoryAdapter(defaultOptions);
                const item = adapter.getItem(NONEXISTENT_KEY);

                expect(item).to.be.undefined;
            });
        });
    });

    describe('getExtra', () => {
        context('when item exists', () => {
            it('should return extra', () => {
                const adapter = createMemoryAdapter(defaultOptions);

                adapter.setItem(FOO_KEY, FOO_VALUE, { some: 'extra' });

                const extra = adapter.getExtra(FOO_KEY);
                const expectedExtra = {
                    namespace: defaultOptions.namespace,
                    some: 'extra'
                };

                expect(extra).to.deep.equal(expectedExtra);
            });
        });

        context('when item does not exist', () => {
            it('should return undefined', () => {
                const adapter = createMemoryAdapter(defaultOptions);
                const extra = adapter.getExtra(NONEXISTENT_KEY);

                expect(extra).to.be.undefined;
            });
        });
    });

    describe('hasItem', () => {
        context('when item exists', () => {
            it('should return true', () => {
                const adapter = createMemoryAdapter(defaultOptions);

                adapter.setItem(FOO_KEY, FOO_VALUE);

                expect(adapter.hasItem(FOO_KEY)).to.be.true;
            });
        });

        context('when item does not exist', () => {
            it('should return false', () => {
                const adapter = createMemoryAdapter(defaultOptions);

                expect(adapter.hasItem(NONEXISTENT_KEY)).to.be.false;
            });
        });
    });

    describe('removeItem', () => {
        context('when item exists', () => {
            it('should remove that item returning true', () => {
                const adapter = createMemoryAdapter(defaultOptions);

                adapter.setItem(FOO_KEY, FOO_VALUE);

                const result = adapter.removeItem(FOO_KEY);

                expect(result).to.be.true;
            });
        });

        context('when item does not exist', () => {
            it('should not remove that item and return false', () => {
                const adapter = createMemoryAdapter(defaultOptions);
                const result = adapter.removeItem(NONEXISTENT_KEY);

                expect(result).to.be.false;
            });
        });
    });
});
