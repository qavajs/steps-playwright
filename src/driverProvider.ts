import { chromium, firefox, webkit, _electron as electron, Browser, BrowserType } from 'playwright';
const browsers: any = { chromium, firefox, webkit, electron };

export async function driverProvider(driverConfig: any): Promise<Browser> {
    const browserName: string = driverConfig?.capabilities?.browserName ?? 'chromium';
    const browserType: BrowserType = browsers[browserName];
    if (driverConfig?.capabilities?.wsEndpoint) {
        return browserType.connect(
            driverConfig?.capabilities?.wsEndpoint,
            driverConfig.capabilities
        );
    }
    if (driverConfig?.capabilities?.cdpEndpoint) {
        return browserType.connectOverCDP(
            driverConfig?.capabilities?.cdpEndpoint,
            driverConfig.capabilities
        );
    }
    return browserType.launch(driverConfig.capabilities);
}
