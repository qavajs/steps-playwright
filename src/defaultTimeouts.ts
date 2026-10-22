import type { PlaywrightTimeouts } from './IQavajsPlaywrightConfig';

const defaultTimeouts: Required<PlaywrightTimeouts> = {
    action: 10_000,
    present: 10_000,
    visible: 10_000,
    page: 10_000,
    networkIdle: 500,
    value: 5000,
    valueInterval: 500,
    actionInterval: 1000,
    pageRefreshInterval: 2000
}

export default defaultTimeouts;
