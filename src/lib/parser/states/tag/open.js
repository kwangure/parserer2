import { h } from 'hine';
import { PElement } from '$lib/parser/nodes';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createOpenState(context) {
	return h.atomic({
		actions: {
			initialize: h.action({
				run() {
					const element = new PElement();
					element.end = context.index + 1;
					element.start = context.index;
					context.stack.push(element);
				},
			}),
		},
		entry: [{
			actions: ['initialize'],
		}],
		on: {
			CHARACTER: [
				{
					transitionTo: 'name',
					condition: 'isAlphaCharacter',
				},
			],
		},
	});
}
