import { createBeforeState } from './name/before.js';
import { createNameState } from './name/name.js';
import { h } from 'hine';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createAttributeState(context) {
	return h.compound({
		always: [
			{
				transitionTo: 'selfClose',
				condition: 'isForwardSlash',
			},
		],
		states: {
			before: createBeforeState(),
			name: createNameState(context),
			done: h.atomic(),
		},
	});
}
