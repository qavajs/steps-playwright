import { chromium, firefox, webkit, Browser, BrowserType } from 'playwright';
const browsers: any = { chromium, firefox, webkit };

export async function driverProvider(driverConfig: any): Promise<Browser> {
    const browserName: string = driverConfig?.capabilities?.browserName ?? 'chromium';
    const browserType: BrowserType = browsers[browserName];
    if (driverConfig?.capabilities?.wsEndpoint) {
        return browserType.connect(
            driverConfig?.capabilities?.wsEndpoint,
            driverConfig.capabilities
        );
    } else if (driverConfig?.capabilities?.cdpEndpoint) {
        return browserType.connectOverCDP(
            driverConfig?.capabilities?.cdpEndpoint,
            driverConfig.capabilities
        );
    } else {
        return browserType.launch(driverConfig.capabilities);
    }
}
