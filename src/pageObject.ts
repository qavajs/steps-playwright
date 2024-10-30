import { type Browser, type BrowserContext, type Page, Locator } from '@playwright/test';

export class Selector {
    selector: string | ((argument: string) => string) | ((x: any) => any);
    component!: Function;
    type: string = 'simple';

    constructor(selector: string | ((argument: string) => string) | ((x: any) => any), type?: string) {
        this.selector = selector;
        if (type) {
            this.type = type;
        }
    }

    /**
     * Define current locator as component
     * @param { new () => void } component
     */
    as(component: new () => void) {
        this.component = component;
        return this;
    }
}

export type NativeSelectorParams = {
    driver: Browser;
    browser: Browser;
    context: BrowserContext;
    page: Page;
    parent: Locator;
    argument: string;
};

/**
 * Define selector
 */
export interface LocatorDefinition {
    (selector: any): Selector;

    /**
     * Define selector as a template
     * @param {(argument: string) => string} selector - selector template
     */
    template: (selector: (argument: string) => string) => Selector;

    /**
     * Define selector using native playwright API
     * @param {(argument: string) => string} selector - selector function
     */
    native: (selector: (params: NativeSelectorParams) => Locator) => Selector;
}

export const locator: LocatorDefinition = function locator(selector: any): Selector {
    return new Selector(selector);
}

locator.template = function(selector: (argument: string) => string) {
    return new Selector(selector, 'template');
}

locator.native = function(selector: (params: NativeSelectorParams) => Locator) {
    return new Selector(selector, 'native');
}

export class ChainItem {
    alias: string;
    argument?: string;
    selector: any;
    type: string;

    constructor({ alias, argument, selector, type }: { alias: string, argument?: string, selector?: string, type: string }) {
        this.alias = alias;
        this.argument = argument;
        this.selector = selector;
        this.type = type;
    }
}

export function query(root: any, path: string) {
    const elements = path.split(/\s*>\s*/);
    const tokens = [];
    let currentComponent = new root();
    let currentAlias = 'root';
    for (const element of elements) {
        const groups = element.match(/^(?<alias>.+?)(?:\((?<argument>.+)\))?$/)?.groups as { alias: string, argument: string };
        const alias = groups.alias.replace(/\s/g, '');
        const currentElement = currentComponent[alias];
        if (!currentElement) throw new Error(`Alias '${alias}' has not been found in '${currentAlias}'`);
        currentAlias = groups.alias;
        currentComponent = currentElement.component ? new currentElement.component() : null;

        tokens.push(new ChainItem({
            alias,
            argument: groups.argument,
            selector: currentElement.selector,
            type: currentElement.type,
        }));
    }

    return tokens;
}

export function element(this: any, path: string): Locator {
    const chain = query(this.config.pageObject, path);
    const page = this.playwright.page as Page;
    let current = page as unknown as Locator;
    for (const item of chain) {
        switch (item.type) {
            case 'simple': current = current.locator(item.selector); break;
            case 'template': current = current.locator(item.selector(item.argument)); break;
            case 'native': current = item.selector({
                driver: this.playwright.driver,
                browser: this.playwright.browser,
                context: this.playwright.context,
                page: this.playwright.page,
                parent: current,
                argument: item.argument
            }); break;
        }
    }
    return current
}