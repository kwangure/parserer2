import { createBeforeState } from './before.js';
import { createTextState } from './text.js';
import { h } from 'hine';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createValueState(context) {
	return h.compound({
		conditions: {
			isDone: h.condition({
				run() {
					return Boolean(this.ownerState?.matches('value.done'));
				},
			}),
		},
		on: {
			CHARACTER: [
				{
					transitionTo: 'done',
					condition: 'isDone',
				},
			],
		},
		states: {
			before: createBeforeState(),
			text: createTextState(context),
			done: h.atomic(),
		},
	});
}
