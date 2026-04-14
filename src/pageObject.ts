import { type Browser, type BrowserContext, type Page, Locator, FrameLocator } from '@playwright/test';

type SelectorDefinition = string | ((argument: string) => string) | ((argument: any) => any) | null;

/**
 * Represents a selector definition used to locate elements on a page.
 * Selectors can be simple CSS/XPath strings, template functions, or native Playwright locator functions.
 */
export class Selector {
    selector: SelectorDefinition;
    component!: Function;
    type: string = 'simple';

    /**
     * @param {SelectorDefinition} selector - The selector value: a string, a template function, or a native locator function
     * @param {string} [type='simple'] - The selector type: `'simple'`, `'template'`, or `'native'`
     */
    constructor(selector: SelectorDefinition, type?: string) {
        this.selector = selector;
        if (type) {
            this.type = type;
        }
    }

    /**
     * Creates a selector that maps directly to a component class without an explicit selector string.
     * Useful for composing page objects where a top-level alias represents a component with its own alias definitions.
     * @param { new () => void } component - The component class whose aliases will be resolved for child lookups
     * @returns {Selector}
     * @example
     * // Resolves child aliases from NavBarComponent without a wrapping selector
     * NavBar = locator('.header').as(NavBarComponent)
     */
    as(component: new () => void) {
        this.component = component;
        return this;
    }
}

/**
 * Parameters passed to native selector functions, providing access to
 * the full Playwright browser hierarchy and the current parent locator.
 */
export type NativeSelectorParams = {
    /** The Playwright Browser instance (alias for `browser`) */
    driver: Browser;
    /** The Playwright Browser instance */
    browser: Browser;
    /** The active BrowserContext */
    context: BrowserContext;
    /** The active Page */
    page: Page;
    /** The parent Locator to scope the selector within */
    parent: Locator;
    /** The runtime argument passed to the selector, if any */
    argument: string;
};

/**
 * Factory function for defining element selectors in a page object.
 * Supports simple string selectors, template functions, native Playwright locators, and component aliases.
 *
 * @example
 * // Simple selector
 * loginButton: locator('button[type="submit"]')
 *
 * @example
 * // Template selector with a runtime argument
 * rowByName: locator.template((name) => `tr:has-text("${name}")`)
 *
 * @example
 * // Native Playwright selector
 * dropdown: locator.native(({ page }) => page.getByRole('combobox'))
 *
 * @example
 * // Component alias — resolves child aliases from the given class
 * header: locator('.header').as(HeaderComponent)
 */
export interface LocatorDefinition {
    /**
     * Creates a simple selector from a CSS/XPath string or a plain value.
     * @param {any} selector - A CSS selector string or other supported value
     * @returns {Selector}
     * @example
     * SubmitButton = locator('button[type="submit"]')
     * @example
     * // XPath selector
     * Row = locator('//table/tbody/tr')
     */
    (selector: any): Selector;

    /**
     * Creates a template selector whose string is computed at runtime from an argument.
     * Use this when the selector depends on a dynamic value passed via the alias path (e.g. `Row(John)`).
     * @param {(argument: string) => string} selector - A function that receives the runtime argument and returns a selector string
     * @returns {Selector}
     * @example
     * // Resolved via alias path: 'Table > Row(John)'
     * RowByName = locator.template((name) => `tr:has-text("${name}")`)
     * @example
     * // Resolved via alias path: 'List > Item(3)'
     * ItemByIndex = locator.template((index) => `.item:nth-child(${index})`)
     */
    template: (selector: (argument: string) => string) => Selector;

    /**
     * Creates a native Playwright selector using the full browser context.
     * Use this for selectors that cannot be expressed as a simple string, such as those
     * requiring `page.getByRole`, frame navigation, or multi-step locator chains.
     * @param {(params: NativeSelectorParams) => Locator | FrameLocator} selector - A function receiving Playwright context and returning a Locator or FrameLocator
     * @returns {Selector}
     * @example
     * // Using a Playwright ARIA role selector
     * Dialog = locator.native(({ page }) => page.getByRole('dialog'))
     * @example
     * // Scoping within a parent locator
     * ActiveRow = locator.native(({ parent }) => parent.locator('tr.active'))
     * @example
     * // Navigating into an iframe
     * IframeContent = locator.native(({ page }) => page.frameLocator('#my-iframe').locator('.content'))
     */
    native: (selector: (params: NativeSelectorParams) => Locator | FrameLocator) => Selector;

    /**
     * Creates a selector that maps directly to a component class without an explicit selector string.
     * Useful for composing page objects where a top-level alias represents a component with its own alias definitions.
     * @param { new () => void } component - The component class whose aliases will be resolved for child lookups
     * @returns {Selector}
     * @example
     * // Resolves child aliases from NavBarComponent without a wrapping selector
     * NavBar = locator('.header').as(NavBarComponent)
     */
    as: (component: new () => void) => Selector;
}

export const locator: LocatorDefinition = function locator(selector: any): Selector {
    return new Selector(selector);
}

locator.template = function(selector: (argument: string) => string) {
    return new Selector(selector, 'template');
}

locator.native = function(selector: (params: NativeSelectorParams) => Locator | FrameLocator): Selector {
    return new Selector(selector, 'native');
}

locator.as = function (component: new () => void) {
    const selector = new Selector(null);
    selector.component = component;
    return selector;
}

/**
 * Represents a single resolved step in an alias chain.
 * Each item corresponds to one segment of a `>` separated alias path (e.g. `Header > Logo`).
 */
export class ChainItem {
    /** The alias name for this step (whitespace stripped) */
    alias: string;
    /** The runtime argument extracted from the alias path, e.g. `'John'` from `Row(John)` */
    argument?: string;
    /** The raw selector value: a string, template function, or native locator function */
    selector: any;
    /** The selector type: `'simple'`, `'template'`, or `'native'` */
    type: string;

    constructor({ alias, argument, selector, type }: { alias: string, argument?: string, selector?: string, type: string }) {
        this.alias = alias;
        this.argument = argument;
        this.selector = selector;
        this.type = type;
    }
}

/**
 * Resolves an alias path against a page object root into a chain of {@link ChainItem} steps.
 * Each `>` separated segment is looked up on the current component; if the component defines
 * a `defaultResolver`, unknown aliases are delegated to it instead of throwing.
 *
 * @param {any} root - A page object class or instance to resolve aliases from
 * @param {string} path - A `>`-separated alias path, where each segment may include an argument in parentheses (e.g. `Header > Row(John) > Cell`)
 * @returns {ChainItem[]} An ordered array of resolved chain items ready for locator construction
 * @throws {Error} If an alias is not found on the current component and no `defaultResolver` is defined
 *
 * @example
 * query(MyPage, 'Header > Logo')
 * query(MyPage, 'Table > Row(John) > EditButton')
 */
export function query(root: any, path: string) {
    const elements = path.split(/\s*>\s*/);
    const tokens = [];
    let currentComponent = typeof root === 'function' ? new root() : root;
    let currentAlias = 'page object root';
    for (const element of elements) {
        const groups = element.match(/^(?<alias>.+?)(?:\((?<argument>.+)\))?$/)?.groups as { alias: string, argument: string };
        const alias = groups.alias.replace(/\s/g, '');
        let currentElement = currentComponent[alias];
        if (!currentElement && (!currentComponent.defaultResolver || typeof currentComponent.defaultResolver !== 'function')) {
            throw new Error(`Alias '${alias}' has not been found in '${currentAlias}'`);
        }
        if (!currentElement && currentComponent.defaultResolver) {
            currentElement = {};
            currentElement.selector = currentComponent.defaultResolver({ alias: groups.alias, argument: groups.argument });
            currentElement.type = 'native';
        }
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

/**
 * Resolves an alias path to a Playwright {@link Locator} by walking the page object chain.
 * Intended to be called with a `this` context that provides `this.config.pageObject`,
 * `this.playwright` (with `driver`, `browser`, `context`, `page`), and a `this.log` method.
 *
 * @param {string} path - A `>`-separated alias path (see {@link query} for syntax)
 * @returns {Locator} The fully resolved Playwright Locator for the given path
 *
 * @example
 * element.call(world, 'Header > SubmitButton')
 */
export function element(this: any, path: string): Locator {
    const chain = query(this.config.pageObject, path);
    const page = this.playwright.page as Page;
    const logger = this;
    let current = page as unknown as Locator;
    for (const item of chain) {
        switch (item.type) {
            case 'simple': current = item.selector ? current.locator(item.selector) : current; break;
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
    logger.log(`${path} -> ${current}`);
    return current
}