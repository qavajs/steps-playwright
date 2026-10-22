import { chromium, firefox, webkit, _electron as electron, Browser, BrowserType } from '@playwright/test';
import type { ResolvedDriverConfig } from './IQavajsPlaywrightConfig';

const browsers: Record<string, BrowserType> = { chromium, firefox, webkit };

export async function driverProvider(driverConfig: ResolvedDriverConfig): Promise<Browser> {
    const capabilities = driverConfig.capabilities;
    const browserName = capabilities.browserName ?? 'chromium';
    if (browserName === 'electron') {
        // electron application is used through Browser-like API, see Playwright class
        return electron.launch(capabilities as Parameters<typeof electron.launch>[0]) as unknown as Promise<Browser>;
    }
    const browserType = browsers[browserName];
    if (!browserType) throw new Error(`Browser '${browserName}' is not supported`);
    if (capabilities.wsEndpoint) {
        return browserType.connect(capabilities.wsEndpoint, capabilities);
    }
    if (capabilities.cdpEndpoint) {
        return browserType.connectOverCDP(capabilities.cdpEndpoint, capabilities);
    }
    return browserType.launch(capabilities);
}
