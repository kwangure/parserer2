import { h } from 'hine';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createNameState(context) {
	/**
	 * @type {import('$lib/parser/nodes').PElement}
	 */
	let element;
	return h.atomic({
		actions: {
			addName: h.action({
				/** @param {string} value */
				run(value) {
					element.name += value;
					element.end = context.index;
				},
			}),
			initialize: h.action({
				run(value) {
					element = context.stack.peek({ expect: ['Element']});
					this.ownerState?.actions.addName.run(value);
				},
			}),
		},
		conditions: {
			isForwardSlash: h.condition({
				/** @param {string} value */
				run: (value) => value === '/',
			}),
		},
		entry: [{
			actions: ['initialize'],
		}],
		on: {
			CHARACTER: [
				{
					transitionTo: 'selfClose',
					condition: 'isForwardSlash',
				},
				{
					actions: ['addName'],
				},
			],
		},
	});
}
