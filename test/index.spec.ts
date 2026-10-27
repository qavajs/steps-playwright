import { test, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const srcDir = join(__dirname, '../src');
const stripComments = (code: string) => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const stepRegistration = /\b(When|Then|Given|Before|After|BeforeAll|AfterAll|BeforeStep|AfterStep|defineParameterType)\(/;

test('index.js requires every module that registers steps, hooks or parameter types', () => {
    const index = readFileSync(join(__dirname, '../index.js'), 'utf-8');
    const stepModules = readdirSync(srcDir)
        .filter(file => file.endsWith('.ts'))
        .filter(file => stepRegistration.test(stripComments(readFileSync(join(srcDir, file), 'utf-8'))))
        .map(file => file.replace(/\.ts$/, ''));
    expect(stepModules.length).toBeGreaterThan(0);
    for (const module of stepModules) {
        expect(index, `${module} is not required in index.js`).toContain(`require('./lib/${module}.js')`);
    }
});
