import { type Browser, type BrowserContext, type Page, Locator, FrameLocator } from '@playwright/test';

type SelectorDefinition = string | ((argument: string) => string) | ((argument: any) => any) | null;

/**
 * Represents a selector definition with optional type and component binding.
 * @example
 * class App {
 *   Button = locator('button[type="submit"]');
 *   ButtonByIndex = locator.template(idx => `#list li:nth-child(${idx})`);
 * }
 */
export class Selector {
    selector: SelectorDefinition;
    component!: Function;
    type: string = 'simple';

    constructor(selector: SelectorDefinition, type?: string) {
        this.selector = selector;
        if (type) {
            this.type = type;
        }
    }

    /**
     * Define current locator as component
     * @param { new () => void } component
     * @example
     * class BodyComponent { TextElement = locator('#textValue'); }
     * class App {
     *   BodyComponent = locator('body').as(BodyComponent);
     * }
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
 * Define selector
 * @example
 * class BodyComponent { TextElement = locator('#textValue'); }
 * class App {
 *   Button = locator('button[type="submit"]');
 *   ButtonByText = locator.template(text => `//button[.="${text}"]`);
 *   ButtonNative = locator.native(({ page }) => page.getByRole('button'));
 *   BodyComponent = locator('body').as(BodyComponent);
 *   BodyNative = locator.native(({ page }) => page.locator('body')).as(BodyComponent);
 *   TopLevelComponent = locator.as(BodyComponent);
 * }
 */
export interface LocatorDefinition {
    (selector: any): Selector;

    /**
     * Define selector as a template
     * @param {(argument: string) => string} selector - selector template
     * @example
     * class App {
     *   ItemByIndex = locator.template(idx => `#list li:nth-child(${idx})`);
     *   ItemByText = locator.template(text => `//ul/li[contains(., "${text}")]`);
     * }
     */
    template: (selector: (argument: string) => string) => Selector;

    /**
     * Define selector using native Playwright API
     * @param {(params: NativeSelectorParams) => Locator | FrameLocator} selector - selector function
     * @example
     * class App {
     *   Dialog = locator.native(({ page }) => page.getByRole('dialog'));
     *   ActiveRow = locator.native(({ parent }) => parent.locator('tr.active'));
     *   IframeContent = locator.native(({ page }) => page.frameLocator('#my-iframe').locator('.content'));
     * }
     */
    native: (selector: (params: NativeSelectorParams) => Locator | FrameLocator) => Selector;

    /**
     * Define component
     * @param { new () => void } component
     * @example
     * class BodyComponent { TextElement = locator('#textValue'); }
     * class App {
     *   TopLevelComponent = locator.as(BodyComponent);
     * }
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
 * Represents a single resolved step in a page-object traversal chain.
 * Produced by {@link query} and consumed by {@link element}.
 * @example
 * // Given App with: User = locator.template(idx => `#users > li:nth-child(${idx})`)
 * // query(App, 'User(2)') returns:
 * // [ChainItem { alias: 'User', selector: fn, type: 'template', argument: '2' }]
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
 * Resolve a `>` delimited alias path against a page-object root and return the
 * ordered list of {@link ChainItem}s needed to locate the element.
 *
 * Path syntax: `"Alias > ChildAlias > TemplateAlias(argument)"`
 *
 * @param root - A page-object class constructor or instance that acts as the traversal root.
 * @param path - A `>` delimited string of alias names, optionally with a single argument in parentheses.
 * @returns {ChainItem[]} Ordered chain of resolved selectors.
 * @throws {Error} When an alias is not found on the current component and no `defaultResolver` is defined.
 * @example
 * class BodyComponent { TextElement = locator('#textValue'); }
 * class App {
 *   BodyComponent = locator('body').as(BodyComponent);
 *   User = locator.template(idx => `#users > li:nth-child(${idx})`);
 * }
 *
 * query(App, 'BodyComponent > TextElement');
 * // => [
 * //   ChainItem { alias: 'BodyComponent', selector: 'body',       type: 'simple' },
 * //   ChainItem { alias: 'TextElement',   selector: '#textValue', type: 'simple' },
 * // ]
 *
 * query(App, 'User(3)');
 * // => [
 * //   ChainItem { alias: 'User', selector: fn, type: 'template', argument: '3' },
 * // ]
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
 * @example
 * element.call(world, 'Header > SubmitButton')
 * element.call(world, 'Table > Row(John) > EditButton')
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
