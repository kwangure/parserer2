import { createEOFState } from './states/eof.js';
import { createFragmentState } from './states/fragment.js';
import { createStartState } from './states/start.js';
import { createTagState } from './states/tag/tag.js';
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
		name: 'parser',
		actions: {
			increment: h.action({
				run() {
					context.index += 1;
				},
			}),
		},
		conditions: {
			isTagOpen: h.condition({
				/** @param {string} value */
				run: (value) => value === '<',
			}),
		},
		on: {
			CHARACTER: [{
				actions: ['increment'],
			}],
		},
		states: {
			start: createStartState(context),
			eof: createEOFState(),
			fragment: createFragmentState(),
			tag: createTagState(context),
			text: createTextState(context),
		},
	}).start();


	return /** @type {import('./types').WritableParserWithContext} */(
		Object.assign(parser, { context })
	);
}

export * from './parse.js';
