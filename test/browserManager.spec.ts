import { describe, test, expect } from 'vitest';
import { Playwright } from '../src/playwright';


class Page {
    isClosed = false;
    async close() {
        this.isClosed = true;
    }
}

class Context {
    _pages: Page[] = [];
    isClosed = false;
    async close() {
        this.isClosed = true;
    }

    async newPage() {
        const page = new Page();
        this._pages.push(page);
        return page;
    }

    pages() {
        return this._pages;
    }
}

class Driver {
    _contexts: Context[] = [];
    isClosed = false;
    async close() {
        this.isClosed = true;
    }
}

class Browser extends Driver {
    async newContext() {
        const context = new Context();
        this._contexts.push(context);
        return context;
    }

    contexts() {
        return this._contexts
    }
}

class ElectronApplication extends Driver {
    constructor() {
        super();
        const context = new Context();
        this._contexts.push(context);
        context._pages.push(new Page());
    }

    context() {
        return this._contexts[0];
    }

    async firstWindow() {
        return this._contexts[0]._pages[0]
    }

    async evaluate() {}
}

function driverProvider(config: any) {
    if (config.browserName === 'electron') return new ElectronApplication();
    return new Browser();
}

describe('launch driver', () => {
    test('launch first browser', async () => {
        const browserManager = new Playwright(driverProvider as any);
        await browserManager.launchDriver('default', { browserName: 'chrome', isElectron: false });
        expect(browserManager.browser).toBeInstanceOf(Browser);
        expect(browserManager.context).toBeInstanceOf(Context);
        expect(browserManager.page).toBeInstanceOf(Page);
        expect(browserManager.page.isClosed).toBe(false);
        expect(browserManager.drivers.default).toBeInstanceOf(Browser);
        expect((browserManager.drivers.default as any).isClosed).toBe(false);
    });

    test('launch first electron', async () => {
        const browserManager = new Playwright(driverProvider as any);
        await browserManager.launchDriver('default', { browserName: 'electron', isElectron: true });
        expect(browserManager.browser).toBeInstanceOf(ElectronApplication);
        expect(browserManager.context).toBeInstanceOf(Context);
        expect(browserManager.page).toBeInstanceOf(Page);
        expect(browserManager.page.isClosed).toBe(false);
        expect(browserManager.drivers.default).toBeInstanceOf(ElectronApplication);
        expect((browserManager.drivers.default as any).isClosed).toBe(false);
    });

    test('launch two browsers', async () => {
        const browserManager = new Playwright(driverProvider as any);
        await browserManager.launchDriver('default', { browserName: 'chrome', isElectron: false });
        await browserManager.launchDriver('second', { browserName: 'chrome', isElectron: false });
        expect(browserManager.drivers.default).toBeInstanceOf(Browser);
        expect(browserManager.drivers.second).toBeInstanceOf(Browser);
        expect((browserManager.drivers.default as any).isClosed).toBe(false);
        expect((browserManager.drivers.second as any).isClosed).toBe(false);
    });

    test('launch electron and browser', async () => {
        const browserManager = new Playwright(driverProvider as any);
        await browserManager.launchDriver('default', { browserName: 'electron', isElectron: true });
        await browserManager.launchDriver('second', { browserName: 'chrome', isElectron: false });
        expect(browserManager.drivers.default).toBeInstanceOf(ElectronApplication);
        expect(browserManager.drivers.second).toBeInstanceOf(Browser);
        expect((browserManager.drivers.default as any).isClosed).toBe(false);
        expect((browserManager.drivers.second as any).isClosed).toBe(false);
    });

    test('reuse session', async () => {
        const browserManager = new Playwright(driverProvider as any);
        await browserManager.launchDriver('default', { browserName: 'chrome', isElectron: false, reuseSession: true });
        const defaultBrowser = browserManager.drivers.default;
        const defaultContext = defaultBrowser.contexts()[0];
        const defaultPage = defaultContext.pages()[0];
        expect(defaultBrowser).toBeInstanceOf(Browser);
        await browserManager.launchDriver('default', { browserName: 'chrome', isElectron: false, reuseSession: true });
        const relaunchedBrowser = browserManager.drivers.default;
        const relaunchedContext = relaunchedBrowser.contexts()[0];
        const relaunchedPage = relaunchedContext.pages()[0];
        expect(relaunchedBrowser).toBeInstanceOf(Browser);
        expect(relaunchedBrowser).toBe(defaultBrowser);
        expect(relaunchedContext).toBe(defaultContext);
        expect(relaunchedPage).toBe(defaultPage);

    });
});

describe('context', () => {
    test('launch new context', async () => {
        const browserManager = new Playwright(driverProvider as any);
        await browserManager.launchDriver('default', {browserName: 'chrome', isElectron: false});
        const defaultBrowser = browserManager.drivers.default;
        await browserManager.launchContext('newContext',{});
        expect(browserManager.context).toBe(defaultBrowser.contexts()[1]);
    });

    test('switch context', async () => {
        const browserManager = new Playwright(driverProvider as any);
        await browserManager.launchDriver('default', {browserName: 'chrome', isElectron: false});
        const defaultBrowser = browserManager.drivers.default;
        await browserManager.launchContext('newContext',{});
        expect(browserManager.context).toBe(defaultBrowser.contexts()[1]);
        expect(browserManager.page).toBe(defaultBrowser.contexts()[1].pages()[0]);
        await browserManager.switchContext('default');
        expect(browserManager.context).toBe(defaultBrowser.contexts()[0]);
        expect(browserManager.page).toBe(defaultBrowser.contexts()[0].pages()[0]);
    });

    test('close current context', async () => {
        const browserManager = new Playwright(driverProvider as any);
        await browserManager.launchDriver('default', {browserName: 'chrome', isElectron: false});
        const defaultBrowser = browserManager.drivers.default;
        await browserManager.launchContext('newContext',{});
        await browserManager.launchContext('newContext2',{});
        expect(browserManager.context).toBe(defaultBrowser.contexts()[2]);
        expect(browserManager.page).toBe(defaultBrowser.contexts()[2].pages()[0]);
        await browserManager.closeContext('newContext2');
        expect(browserManager.context).toBe(defaultBrowser.contexts()[0]);
        expect(browserManager.page).toBe(defaultBrowser.contexts()[0].pages()[0]);
    });

    test('close other context', async () => {
        const browserManager = new Playwright(driverProvider as any);
        await browserManager.launchDriver('default', {browserName: 'chrome', isElectron: false});
        const defaultBrowser = browserManager.drivers.default;
        await browserManager.launchContext('newContext',{});
        await browserManager.launchContext('newContext2',{});
        expect(browserManager.context).toBe(defaultBrowser.contexts()[2]);
        expect(browserManager.page).toBe(defaultBrowser.contexts()[2].pages()[0]);
        await browserManager.closeContext('newContext');
        expect(browserManager.context).toBe(defaultBrowser.contexts()[2]);
        expect(browserManager.page).toBe(defaultBrowser.contexts()[2].pages()[0]);
    });

    test('launch new context if not driver launched', async () => {
        const browserManager = new Playwright(driverProvider as any);
        expect(() => browserManager.launchContext('newContext',{})).rejects.toThrow('No active drivers launched')
    });

    test('switch to not existing context', async () => {
        const browserManager = new Playwright(driverProvider as any);
        await browserManager.launchDriver('default', { browserName: 'chrome', isElectron: false });
        expect(() => browserManager.switchContext('context2')).rejects.toThrow(`Context 'context2' was not found`)
    });

});

describe('switch driver', () => {
    test('switch to other browser', async () => {
        const browserManager = new Playwright(driverProvider as any);
        await browserManager.launchDriver('default', { browserName: 'chrome', isElectron: false });
        await browserManager.launchDriver('second', { browserName: 'chrome', isElectron: false });
        await browserManager.switchDriver('second');
        const expectedBrowser = browserManager.drivers.second as any;
        expect(browserManager.browser).toBe(expectedBrowser);
        const expectedContext = expectedBrowser._contexts[0];
        expect(browserManager.context).toBe(expectedContext);
        expect(browserManager.page).toBe(expectedContext._pages[0]);
    });

    test('switch to electron', async () => {
        const browserManager = new Playwright(driverProvider as any);
        await browserManager.launchDriver('default', { browserName: 'electron', isElectron: true });
        await browserManager.launchDriver('chrome', { browserName: 'chrome', isElectron: false });
        await browserManager.switchDriver('chrome');
        const chrome = browserManager.drivers.chrome as any;
        expect(browserManager.browser).toBe(chrome);
        const chromeDefaultContext = chrome._contexts[0];
        expect(browserManager.context).toBe(chromeDefaultContext);
        expect(browserManager.page).toBe(chromeDefaultContext._pages[0]);

        await browserManager.switchDriver('default');
        const electron = browserManager.drivers.default as any;
        expect(browserManager.browser).toBe(electron);
        const electronContext = electron._contexts[0];
        expect(browserManager.context).toBe(electronContext);
        expect(browserManager.page).toBe(electronContext._pages[0]);
    });

    test('switch to not existing driver', async () => {
        const browserManager = new Playwright(driverProvider as any);
        await browserManager.launchDriver('default', { browserName: 'chrome', isElectron: false });
        expect(() => browserManager.switchDriver('chrome')).rejects.toThrow(`Driver 'chrome' was not found`)
    });

});

describe('teardown', () => {
    test('single browser', async () => {
        const browserManager = new Playwright(driverProvider as any);
        await browserManager.launchDriver('default', { browserName: 'chrome', isElectron: false });
        const expectedBrowser = browserManager.drivers.default as any;
        await browserManager.teardown();
        expect(browserManager.browser).toBe(expectedBrowser);
    });

    test('single electron', async () => {
        const browserManager = new Playwright(driverProvider as any);
        await browserManager.launchDriver('default', { browserName: 'electron', isElectron: true });
        await browserManager.teardown();
        expect(browserManager.drivers.default).toBe(undefined);
    });

    test('electron and browser', async () => {
        const browserManager = new Playwright(driverProvider as any);
        await browserManager.launchDriver('default', { browserName: 'electron', isElectron: true });
        await browserManager.launchDriver('chrome', { browserName: 'chrome', isElectron: false });
        await browserManager.teardown();
        expect(browserManager.drivers.default).toBe(undefined);
        expect(browserManager.drivers.chrome).toBe(undefined);
    });

    test('close current driver', async () => {
        const browserManager = new Playwright(driverProvider as any);
        await browserManager.launchDriver('default', { browserName: 'chrome', isElectron: false });
        await browserManager.launchDriver('chrome1', { browserName: 'chrome', isElectron: false });
        await browserManager.launchDriver('chrome2', { browserName: 'chrome', isElectron: false });
        expect(browserManager.browser).toBe(browserManager.drivers.chrome2);
        await browserManager.closeDriver('chrome2')
        expect(browserManager.browser).toBe(browserManager.drivers.default);
        expect(browserManager.drivers.chrome2).toBe(undefined);
    });

    test('close other driver', async () => {
        const browserManager = new Playwright(driverProvider as any);
        await browserManager.launchDriver('default', { browserName: 'chrome', isElectron: false });
        await browserManager.launchDriver('chrome1', { browserName: 'chrome', isElectron: false });
        await browserManager.launchDriver('chrome2', { browserName: 'chrome', isElectron: false });
        expect(browserManager.browser).toBe(browserManager.drivers.chrome2);
        await browserManager.closeDriver('chrome1')
        expect(browserManager.browser).toBe(browserManager.drivers.chrome2);
        expect(browserManager.drivers.chrome1).toBe(undefined);
    });

    test('close all drivers', async () => {
        const browserManager = new Playwright(driverProvider as any);
        await browserManager.launchDriver('default', { browserName: 'chrome', isElectron: false });
        await browserManager.launchDriver('chrome1', { browserName: 'chrome', isElectron: false });
        await browserManager.launchDriver('chrome2', { browserName: 'chrome', isElectron: false });
        await browserManager.launchDriver('electron', { browserName: 'electron', isElectron: true });
        await browserManager.close();
        expect(browserManager.drivers).toEqual({});
    });

    test('close not existing driver', async () => {
        const browserManager = new Playwright(driverProvider as any);
        await browserManager.launchDriver('default', { browserName: 'chrome', isElectron: false });
        expect(() => browserManager.closeDriver('chrome')).rejects.toThrow(`Driver 'chrome' was not found`)
    });

    test('reuse session browser', async () => {
        const browserManager = new Playwright(driverProvider as any);
        await browserManager.launchDriver('default', { browserName: 'chrome', isElectron: false, reuseSession: true });
        const expectedBrowser = browserManager.drivers.default as any;
        await browserManager.teardown({ reuseSession: true });
        expect(browserManager.browser).toBe(expectedBrowser);
    });

    test('reuse session electron', async () => {
        const browserManager = new Playwright(driverProvider as any);
        await browserManager.launchDriver('default', { browserName: 'electron', isElectron: true, reuseSession: true });
        const expectedBrowser = browserManager.drivers.default as any;
        await browserManager.teardown({ reuseSession: true });
        expect(browserManager.browser).toBe(expectedBrowser);
    });

});
