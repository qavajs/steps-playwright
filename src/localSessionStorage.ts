import { When } from '@cucumber/cucumber';
import { getValue } from './transformers';
import memory from '@qavajs/memory';

/**
 * Set value of local/session storage
 * @param {string} storageKey - local/session storage key to set value
 * @param {string} storageType - storage type (local or session)
 * @param {string} value - value to set
 * @example I set 'username' local storage value as 'user1'
 * @example I set '$sessionStorageKey' session storage value as '$sessionStorageValue'
 */
When('I set {string} {word} storage value as {string}', async function (storageKey, storageType, value) {
    await page.evaluate(function ([storageKey, storageType, value]) {
        const storage: string = storageType + 'Storage';
        // @ts-ignore
        window[storage].setItem(storageKey, value);
    }, [await getValue(storageKey), storageType, await getValue(value)]);
});

/**
 * Save value of local/session storage to memory
 * @param {string} storageKey - local/session storage key to set value
 * @param {string} storageType - storage type (local or session)
 * @param {string} key - memory key
 * @example I save value of 'username' local storage as 'localStorageValue'
 * @example I save value of '$sessionStorageKey' session storage value as 'sessionStorageValue'
 */
When('I save value of {string} {word} storage as {string}', async function (storageKey, storageType, key) {
    const value = await page.evaluate(function ([storageKey, storageType]) {
        const storage: string = storageType + 'Storage';
        // @ts-ignore
        return window[storage].getItem(storageKey);
    }, [await getValue(storageKey), storageType]);
    memory.setValue(key, value);
});
