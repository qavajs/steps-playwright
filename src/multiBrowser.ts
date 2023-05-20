import { When } from '@cucumber/cucumber';

/**
 * Open new browser context
 * @param {string} browserContextName - browser context name
 * @example
 * When I open new browser context as 'browser2'
 */
When('I open new browser context as {string}', async function (browserContextName: string) {
    if (!global.contexts) {
        global.contexts = {};
        global.contexts.default = global.context;
    }
    const newContext= await global.browser.newContext(config?.driverConfig?.capabilities);
    await newContext.newPage();
    global.contexts[browserContextName] = newContext;
});

/**
 * Switch to browser context
 * @param {string} browserContextName - browser context name
 * @example
 * When I open new browser context as 'browser2'
 * And I switch to 'browser2' browser context
 * And I switch to 'default' browser context
 */
When('I switch to {string} browser context', async function (browserContextName: string) {
    if (!global.contexts) throw new Error('No other browser context launched');
    const targetContext = global.contexts[browserContextName];
    if (!targetContext) throw new Error(`'${browserContextName}' context is not defined`);
    global.context = targetContext;
    global.page = targetContext.pages()[0];
});

/**
 * Close to browser context
 * @param {string} browserContextName - browser context name
 * @example
 * When I close to 'browser2' browser context
 */
When('I close {string} browser context', async function (browserContextName: string) {
    if (!global.contexts) throw new Error('No other browser context launched');
    const targetContext = global.contexts[browserContextName];
    if (!targetContext) throw new Error(`'${browserContextName}' context is not defined`);
    await targetContext.close();
    global.context = global.contexts.default;
    global.page = context.pages()[0];
    delete global.contexts[browserContextName];
});


