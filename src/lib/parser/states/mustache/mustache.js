import { createBeforeState } from './before';
import { createBlockState } from './block/block';
import { createRawState } from './raw';
import { h } from 'hine';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createMustacheState(context) {
	return h.compound({
		conditions: {
			isDone: h.condition(({ ownerState }) => Boolean(ownerState?.matches('mustache.done'))),
			isHashTag: h.condition(({ value }) => value === '#'),
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
			block: createBlockState(context),
			raw: createRawState(context),
			done: h.atomic(),
		},
	});
}
