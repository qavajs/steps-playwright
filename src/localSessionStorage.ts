import { When } from '@cucumber/cucumber';
import { MemoryValue } from '@qavajs/cli';
/**
 * Set value of local/session storage
 * @param {string} storageKey - local/session storage key to set value
 * @param {string} storageType - storage type (local or session)
 * @param {string} value - value to set
 * @example I set 'username' local storage value as 'user1'
 * @example I set '$sessionStorageKey' session storage value as '$sessionStorageValue'
 */
When('I set {value} {word} storage value as {value}', async function (storageKey: MemoryValue, storageType: string, value: MemoryValue) {
    await this.playwright.page.evaluate(function ([storageKey, storageType, value]: [string, string, string]) {
        const storage: string = storageType + 'Storage';
        // @ts-ignore
        window[storage].setItem(storageKey, value);
    }, [await storageKey.value(), storageType, await value.value()]);
});

/**
 * Save value of local/session storage to memory
 * @param {string} storageKey - local/session storage key to set value
 * @param {string} storageType - storage type (local or session)
 * @param {string} key - memory key
 * @example I save value of 'username' local storage as 'localStorageValue'
 * @example I save value of '$sessionStorageKey' session storage value as 'sessionStorageValue'
 */
When('I save value of {value} {word} storage as {value}', async function (storageKey, storageType, key) {
    const value = await this.playwright.page.evaluate(function ([storageKey, storageType]: [string, string]) {
        const storage: string = storageType + 'Storage';
        // @ts-ignore
        return window[storage].getItem(storageKey);
    }, [await storageKey.value(), storageType]);
    key.set(value);
});
