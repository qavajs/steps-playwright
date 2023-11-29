import { driverProvider } from './driverProvider';
import { Browser, BrowserContext, ElectronApplication, Page } from 'playwright';

type BrowserDict = {
    [key: string]: Browser;
}

interface NamedContext extends BrowserContext {
    name?: string;
}

export class BrowserManager {
    public drivers: BrowserDict = {};
    public driver?: Browser;
    public context?: NamedContext;
    public page?: Page;
    private readonly driverProvider: (config: any) => Promise<Browser>;

    constructor(driverProvider: (config: any) => Promise<Browser>) {
        this.driverProvider = driverProvider;
    }
    async launchDriver(key: string, driverConfig: any) {
        const driverInstance = (key === 'default' && this.drivers.default)
            ? this.drivers.default
            : await this.driverProvider(driverConfig);
        this.drivers[key] = driverInstance;
        this.setDriver(driverInstance);
        if (driverConfig.isElectron) {
            this.setContext((driverInstance as any as ElectronApplication).context());
            this.setPage(await (driverInstance as any as ElectronApplication).firstWindow())
        } else {
            const context = await driverInstance.newContext(driverConfig);
            this.setContext(context);
            this.setPage(await context.newPage());
        }
        (this.context as NamedContext).name = 'default';
    }

    async launchContext(key: string, contextConfig: any) {
        if (!this.driver) throw new Error('No active drivers launched');
        const newContext: NamedContext = await driver.newContext(contextConfig);
        newContext.name = key;
        const newPage = await newContext.newPage();
        this.setContext(newContext);
        this.setPage(newPage);
    }

    async switchDriver(key: string) {
        const currentDriver = this.drivers[key];
        if (!currentDriver) throw new Error(`Driver '${key}' was not found`);
        this.setDriver(currentDriver);
        this.setContext(this.getDefaultContext());
        this.setPage(await this.getFirstPage());
    }

    async switchContext(key: string) {
        const currentContext = this.findContext(key);
        this.setContext(currentContext);
        this.setPage(await this.getFirstPage());
    }

    async closeContext(key: string) {
        const currentContext = this.findContext(key);
        await currentContext.close();
        if (this.context === currentContext) {
            this.setContext(this.getDefaultContext());
            this.setPage(await this.getFirstPage());
        }
    }

    findContext(key: string) {
        const currentContext = this.driver?.contexts().find((ctx: NamedContext) => ctx.name === key);
        if (!currentContext) throw new Error(`Context '${key}' was not found`);
        return currentContext;
    }
    async closeDriver(driverKey: string) {
        const currentDriver = this.drivers[driverKey];
        if (!currentDriver) throw new Error(`Driver '${driverKey}' was not found`);
        await currentDriver.close();
        delete this.drivers[driverKey];
        if (this.driver === currentDriver) {
            this.setDriver(this.drivers['default']);
            this.setContext(this.getDefaultContext());
            this.setPage(await this.getFirstPage());
        }
    }

    /**
     * return to default state (1 browser, no contexts)
     */
    async teardown() {
        for (const driverKey in this.drivers) {
            const driverInstance = this.drivers[driverKey] as any;
            if (driverInstance.firstWindow) {
                await this.electronTeardown(driverInstance, driverKey);
            } else {
                await this.browserTeardown(driverInstance, driverKey);
            }
        }
        this.driver = this.drivers['default'];
    }

    async browserTeardown(driverInstance: Browser, driverKey: string) {
        if (driverKey !== 'default') {
            await driverInstance.close();
            delete this.drivers[driverKey];
        } else {
            const contexts = driverInstance.contexts() as BrowserContext[];
            for (const ctx of contexts) {
                await ctx.close();
            }
        }
    }

    async electronTeardown(driverInstance: ElectronApplication, driverKey: string) {
        await driverInstance.evaluate((main: any) => { main.app.exit(0) });
        delete this.drivers[driverKey];
    }

    async close() {
        for (const driverKey in this.drivers) {
            const driverInstance = this.drivers[driverKey] as any;
            await driverInstance.close();
            delete this.drivers[driverKey];
        }
    };

    getDefaultContext(): BrowserContext {
        const currentDriver: any = this.driver;
        return currentDriver.context ? currentDriver.context() : currentDriver.contexts()[0];
    }

    async getFirstPage(): Promise<Page> {
        const currentDriver: any = this.driver;
        const currentContext: any = this.context;
        return currentDriver.firstWindow ? currentDriver.firstWindow() : currentContext.pages()[0];
    }

    setDriver(driver: any) {
        this.driver = global.browser = global.driver = driver;
    }

    setContext(context: any) {
        this.context = global.context = context;
    }

    setPage(page: any) {
        this.page = global.page = page;
    }

}

export default new BrowserManager(driverProvider);
