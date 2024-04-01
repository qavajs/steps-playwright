import { setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { PlaywrightWorld } from '@qavajs/playwright-runner-adapter'
import { po } from '@qavajs/po-playwright';
import memory from '@qavajs/memory';
import { join } from 'node:path';
import defaultTimeouts from '../defaultTimeouts';
declare global {
    var browser: Browser
    var driver: Browser;
    var context: BrowserContext;
    var page: Page;
    var config: any;
}

class QavaJSPlaywrightWorld extends PlaywrightWorld {
    init = async ({ browser, context, page }: { browser: Browser, context: BrowserContext, page: Page }) => {
        const configFile = require(join(process.cwd(), process.env.CONFIG as string));
        global.config = configFile[process.env.PROFILE as string];
        const driverConfig = config.browser ?? config.driver;
        driverConfig.timeout = {
            ...defaultTimeouts,
            ...driverConfig.timeout
        }
        config.driverConfig = driverConfig;
        global.browser = global.driver = browser;
        global.context = context;
        global.page = page;
        po.init(page, { timeout: config.driverConfig.timeout.present, logger: this });
        po.register(config.pageObject);
        memory.register(config.memory);
    }
}

setWorldConstructor(QavaJSPlaywrightWorld);
