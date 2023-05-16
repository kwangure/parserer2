import { h } from 'hine';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createStartState(context) {
	return h.atomic({
		actions: {
			initialize: h.action({
				run() {
					context.index = 0;
					context.html.clear();
					context.stack.clear();
					context.stack.push(context.html);
				},
			}),
		},
		entry: [{
			actions: ['initialize'],
		}],
		on: {
			INIT: [{
				transitionTo: 'fragment',
			}],
		},
	});
}
