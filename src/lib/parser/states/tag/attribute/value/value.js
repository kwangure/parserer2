import { createBeforeState } from './before.js';
import { createTextState } from './text.js';
import { h } from 'hine';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createValueState(context) {
	return h.compound({
		states: {
			before: createBeforeState(),
			text: createTextState(context),
			done: h.atomic(),
		},
	});
}
