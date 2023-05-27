import { createBeforeState } from './before';
import { createRawState } from './raw';
import { h } from 'hine';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createMustacheState(context) {
	return h.compound({
		conditions: {
			isDone: h.condition({
				run() {
					return Boolean(this.ownerState?.matches('mustache.done'));
				},
			}),
		},
		on: {
			CHARACTER: [
				{
					transitionTo: 'fragment',
					condition: 'isDone',
				},
			],
		},
		states: {
			before: createBeforeState(),
			raw: createRawState(context),
			done: h.atomic(),
		},
	});
}
