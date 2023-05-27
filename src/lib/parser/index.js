import { createEOFState } from './states/eof.js';
import { createFragmentState } from './states/fragment.js';
import { createMustacheState } from './states/mustache/mustache.js';
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
			isMustacheClose: h.condition((value) => value === '}'),
			isMustacheOpen: h.condition((value) => value === '{'),
			isTagClose: h.condition((value) => value === '>'),
			isTagOpen: h.condition((value) => value === '<'),
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
			mustache: createMustacheState(context),
			tag: createTagState(context),
			text: createTextState(context),
		},
	}).start();


	return /** @type {import('./types').WritableParserWithContext} */(
		Object.assign(parser, { context })
	);
}

export * from './parse.js';
