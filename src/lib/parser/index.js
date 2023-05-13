import { createEOFState } from './states/eof.js';
import { createStartState } from './states/start.js';
import { createTextState } from './states/text.js';
import { h } from 'hine';
import { PFragment } from './nodes.js';
import { PStack } from './stack.js';

export function createParser() {
	/** @type {import('./types').ParserContext} */
	const context = {
		index: 0,
		html: new PFragment(),
		stack: new PStack(),
	};

	const parser = h.compound({
		actions: {
			increment: h.action({
				run() {
					context.index += 1;
				},
			}),
		},
		states: {
			start: createStartState(context),
			eof: createEOFState(),
			text: createTextState(context),
		},
	}).start();


	const parserWithContext = Object.assign(parser, { context });

	/**
	 * Teach TypeScript that the writable value has a `context` property
	 *
	 * @typedef {typeof parserWithContext & import('svelte/store').Writable<typeof parserWithContext>} ParserWithContext
	 */

	return /** @type {ParserWithContext} */(parserWithContext);
}

export * from './parse.js';
