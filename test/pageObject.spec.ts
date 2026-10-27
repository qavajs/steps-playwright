import { describe, test, expect, vi } from 'vitest';
import { locator, query, element } from '../src/pageObject';

class BodyComponent {
    TextElement = locator('#textValue');
}

class ResolverComponent {
    defaultResolver({ alias, argument }: { alias: string, argument?: string }) {
        return ({ parent }: any) => `${parent}>${alias}:${argument}`;
    }
}

class App {
    Button = locator('button');
    User = locator.template((idx: string) => `#users > li:nth-child(${idx})`);
    Native = locator.native(({ page }: any) => page.getByRole('dialog'));
    BodyComponent = locator('body').as(BodyComponent);
    TopLevelComponent = locator.as(BodyComponent);
    Resolver = locator('div').as(ResolverComponent);
}

describe('query', () => {
    test('simple alias', () => {
        const [item] = query(App, 'Button');
        expect(item).toMatchObject({ alias: 'Button', selector: 'button', type: 'simple' });
    });

    test('alias with spaces', () => {
        const [item] = query(new App(), 'Body Component');
        expect(item).toMatchObject({ alias: 'BodyComponent', selector: 'body' });
    });

    test('template alias with argument', () => {
        const [item] = query(App, 'User(3)');
        expect(item.type).toBe('template');
        expect(item.argument).toBe('3');
        expect(item.selector(item.argument)).toBe('#users > li:nth-child(3)');
    });

    test('argument with parentheses', () => {
        const [item] = query(App, 'User(a(b))');
        expect(item.argument).toBe('a(b)');
    });

    test('component chain', () => {
        const chain = query(App, 'BodyComponent > TextElement');
        expect(chain.map(i => i.selector)).toEqual(['body', '#textValue']);
    });

    test('top level component', () => {
        const chain = query(App, 'TopLevelComponent > TextElement');
        expect(chain.map(i => i.selector)).toEqual([null, '#textValue']);
    });

    test('default resolver', () => {
        const [, item] = query(App, 'Resolver > Any Thing(1)');
        expect(item.type).toBe('native');
        expect(item.selector({ parent: 'p' })).toBe('p>Any Thing:1');
    });

    test('unknown alias', () => {
        expect(() => query(App, 'Missing')).toThrow(`Alias 'Missing' has not been found in 'page object root'`);
    });

    test('unknown nested alias', () => {
        expect(() => query(App, 'BodyComponent > Missing')).toThrow(`Alias 'Missing' has not been found in 'BodyComponent'`);
    });

    test('alias of non component', () => {
        expect(() => query(App, 'Button > Child')).toThrow(`Alias 'Child' has not been found in 'Button', because 'Button' is not a component`);
    });

    test('empty alias', () => {
        expect(() => query(App, 'BodyComponent >')).toThrow(`Empty alias in 'BodyComponent >' path`);
    });
});

describe('element', () => {
    function createLocator(path: string): any {
        return {
            path,
            locator: (selector: string) => createLocator(`${path} >> ${selector}`),
            toString: () => path
        };
    }

    function world() {
        const page = createLocator('page');
        page.getByRole = (role: string) => createLocator(`page >> role=${role}`);
        return {
            config: { pageObject: new App() },
            playwright: { page, driver: {}, browser: {}, context: {} } as any,
            log: vi.fn()
        };
    }

    test('resolves chain of locators', () => {
        const ctx = world();
        const result: any = element.call(ctx, 'BodyComponent > TextElement');
        expect(result.path).toBe('page >> body >> #textValue');
        expect(ctx.log).toHaveBeenCalledWith('BodyComponent > TextElement -> page >> body >> #textValue');
    });

    test('resolves template', () => {
        const result: any = element.call(world(), 'User(2)');
        expect(result.path).toBe('page >> #users > li:nth-child(2)');
    });

    test('resolves native', () => {
        const result: any = element.call(world(), 'Native');
        expect(result.path).toBe('page >> role=dialog');
    });

    test('skips empty selector of top level component', () => {
        const result: any = element.call(world(), 'TopLevelComponent > TextElement');
        expect(result.path).toBe('page >> #textValue');
    });
});
