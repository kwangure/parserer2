import { h } from 'hine';

/**
 * @param {import('../types').ParserContext} context
 */
export function createStartState(context) {
	return h.atomic({
		actions: {
			initialize: h.action({
				run() {
					context.index = 0;
					context.html.clear();
					context.stack.clear();
				},
			}),
		},
		entry: [{
			actions: ['initialize'],
		}],
		on: {
			INIT: [{
				transitionTo: 'text',
			}],
		},
	});
}
