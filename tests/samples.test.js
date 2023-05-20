import { createParser, parseFile, toSvelteAST } from '$lib/parser';
import { describe, expect, test } from 'vitest';
import fs from 'node:fs';
import { tryToLoadJson } from './helpers.js';

describe('parse', () => {
	const samples = fs.readdirSync(`${__dirname}/samples`);
	for (const dir of samples) {
		if (dir[0] === '.') return;

		// add .solo to a sample directory name to only run that test
		const solo = (/\.solo$/).test(dir);

		if (solo && process.env.CI) {
			throw new Error(
				`Forgot to remove '.solo' from test test/samples/${dir}`,
			);
		}

		// add .skip to a sample directory name to skip that test
		let skip = (/\.skip$/).test(dir);
		if (skip && process.env.CI) {
			throw new Error(
				`Forgot to remove '.skip' from test test/samples/${dir}`,
			);
		}

		if (!fs.existsSync(`${__dirname}/samples/${dir}/input.svelte`)) {
			skip = true;
		}

		/** @type {typeof test | typeof test.skip} */
		let runner = test;
		if (skip) {
			runner = test.skip;
		} else if (solo) {
			runner = test.only;
		}

		runner(dir, () => {
			const input = fs
				.readFileSync(`${__dirname}/samples/${dir}/input.svelte`, 'utf-8')
				.replace(/\s+$/, '')
				.replace(/\r/g, '');
			const expectedOutput = tryToLoadJson(`${__dirname}/samples/${dir}/output.json`);

			const parser = createParser();
			parseFile(parser, input);
			const actualOutput = toSvelteAST(parser);
			fs.writeFileSync(`${__dirname}/samples/${dir}/_actual.json`, JSON.stringify(actualOutput, null, 4));
			expect(actualOutput).toEqual(expectedOutput);
		});
	}
});
