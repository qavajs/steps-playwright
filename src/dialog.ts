import { Dialog } from '@playwright/test';
import { type MemoryValue, type Validation, When, Then } from '@qavajs/core';
import { QavajsPlaywrightWorld } from './QavajsPlaywrightWorld';

class DialogHolder {
    currentDialog!: Promise<Dialog>;
    isListening: boolean = false;
}

const dialogHolder = new DialogHolder();

function checkIfListening(isListening: boolean) {
    if (!isListening) {
        throw new Error(`Step 'I will wait for alert/dialog' must be called before`);
    }
}

/**
 * Start listen for alert
 * @example I will wait for dialog
 */
When('I will wait for alert/dialog', async function (this: QavajsPlaywrightWorld) {
    dialogHolder.isListening = true;
    dialogHolder.currentDialog = new Promise(resolve => this.playwright.page.once('dialog', resolve));
});

/**
 * Accept alert
 * @example I accept alert
 */
When('I accept alert/dialog', async function (this: QavajsPlaywrightWorld) {
    checkIfListening(dialogHolder.isListening);
    const dialog = await dialogHolder.currentDialog;
    await dialog.accept();
});

/**
 * Dismiss alert
 * Playwright automatically dismisses all dialogs. This step is just to make it implicitly.
 * @example I dismiss alert
 */
When('I dismiss alert/dialog', async function (this: QavajsPlaywrightWorld) {
    checkIfListening(dialogHolder.isListening);
    const dialog = await dialogHolder.currentDialog;
    await dialog.dismiss();
});

/**
 * I type {string} to alert
 * @example I type 'coffee' to alert
 */
When('I type {value} to alert/dialog', async function (this: QavajsPlaywrightWorld, value: MemoryValue) {
    checkIfListening(dialogHolder.isListening);
    const typeValue = await value.value();
    const dialog = await dialogHolder.currentDialog;
    await dialog.accept(typeValue);
});

/**
 * Verify that text of an alert meets expectation
 * @param {string} validationType - validation
 * @param {string} value - expected text value
 * @example I expect text of alert does not contain 'coffee'
 */
Then(
    'I expect text of alert/dialog {validation} {value}',
    async function (this: QavajsPlaywrightWorld, validation: Validation, expected: MemoryValue) {
        checkIfListening(dialogHolder.isListening);
        const dialog = await dialogHolder.currentDialog;
        const message = dialog.message();
        const expectedValue = await expected.value();
        validation(message, expectedValue);
    }
);