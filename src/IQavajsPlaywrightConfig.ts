import type { BrowserContextOptions, LaunchOptions } from '@playwright/test';

export interface PlaywrightTimeouts {
  /**
   * Playwright action timeout (applied as context default timeout)
   *
   * default: 10_000
   * @example
   * export default {
   *     action: 20_000
   * }
   */
  action?: number,
  /**
   * Element presence timeout
   *
   * default: 10_000
   * @example
   * export default {
   *     present: 20_000
   * }
   */
  present?: number,
  /**
   * Element visibility timeout
   *
   * default: 10_000
   * @example
   * export default {
   *     visible: 20_000
   * }
   */
  visible?: number,
  /**
   * Page load timeout
   *
   * default: 10_000
   * @example
   * export default {
   *     page: 20_000
   * }
   */
  page?: number,
  /**
   * Network inactivity timeout
   *
   * default: 500
   * @example
   * export default {
   *     networkIdle: 2_000
   * }
   */
  networkIdle?: number,
  /**
   * Element value timeout
   *
   * default: 5_000
   * @example
   * export default {
   *     value: 10_000
   * }
   */
  value?: number,
  /**
   * Interval for checking a value in polling validations
   *
   * default: 500
   * @example
   * export default {
   *     valueInterval: 1_500
   * }
   */
  valueInterval?: number,
  /**
   * Interval for steps performing actions in loop unless some validation to be met
   *
   * default: 1_000
   * @example
   * export default {
   *     actionInterval: 2_000,
   * }
   */
  actionInterval?: number,
  /**
   * Interval for steps refreshing page in loop unless some validation to be met
   *
   * default: 2_000
   * @example
   * export default {
   *     pageRefreshInterval: 10_000
   * }
   */
  pageRefreshInterval?: number
}

export type ScreenshotEventName = 'onFail' | 'beforeStep' | 'afterStep';
export type ArtifactEventName = 'onFail' | 'afterScenario';

export type PlaywrightCapabilities = LaunchOptions & BrowserContextOptions & {
  /**
   * Browser to launch
   *
   * default: chromium
   */
  browserName?: 'chromium' | 'firefox' | 'webkit' | 'electron',
  /**
   * Connect to running playwright server instead of launching a browser
   */
  wsEndpoint?: string,
  /**
   * Connect to CDP endpoint instead of launching a browser
   */
  cdpEndpoint?: string,
  /**
   * Working directory of electron application
   */
  cwd?: string
};

export interface PlaywrightDriverConfig {
  /**
   * Timeouts configuration
   * Enables flexible configuration of validation timeouts and polling intervals to enhance test robustness.
   */
  timeout?: PlaywrightTimeouts,
  /**
   * Browser launch and context options
   * @example
   * export default {
   *     capabilities: { browserName: 'chromium', headless: true }
   * }
   */
  capabilities?: PlaywrightCapabilities,
  /**
   * Screenshot strategy
   * @example
   * export default {
   *     screenshot: { event: ['onFail'], fullPage: true }
   * }
   */
  screenshot?: ScreenshotEventName | ScreenshotEventName[] | {
    event: ScreenshotEventName | ScreenshotEventName[],
    fullPage?: boolean
  },
  /**
   * Playwright trace recording
   * @example
   * export default {
   *     trace: { event: ['onFail'], dir: 'traces', attach: true }
   * }
   */
  trace?: {
    event: ArtifactEventName | ArtifactEventName[],
    /** default: traces */
    dir?: string,
    /** attach trace to report. default: false */
    attach?: boolean,
    /** default: true */
    screenshots?: boolean,
    /** default: true */
    snapshots?: boolean
  },
  /**
   * Video recording
   * @example
   * export default {
   *     video: { event: ['onFail'], dir: 'video', size: { width: 640, height: 480 }, attach: true }
   * }
   */
  video?: {
    event: ArtifactEventName | ArtifactEventName[],
    dir?: string,
    size?: { width: number, height: number },
    /** attach video to report. default: false */
    attach?: boolean
  },
  /**
   * Share browser session between scenarios in frames of process
   */
  reuseSession?: boolean,
  /**
   * Restart browser between scenarios instead of restarting context
   */
  restartBrowser?: boolean
}

/**
 * Driver config with defaults applied; available as `this.config.driverConfig`
 */
export interface ResolvedDriverConfig extends PlaywrightDriverConfig {
  timeout: Required<PlaywrightTimeouts>,
  capabilities: PlaywrightCapabilities,
  isElectron: boolean
}

export interface IQavajsPlaywrightConfig {
  browser?: PlaywrightDriverConfig,
  /**
   * Alias for `browser`
   */
  driver?: PlaywrightDriverConfig
}
