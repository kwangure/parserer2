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
				run() {
					element = context.stack.peek({ expect: ['Element']});
				},
			}),
		},
		entry: [{
			actions: [
				'initialize',
				'addName',
			],
		}],
		on: {
			CHARACTER: [
				{
					transitionTo: 'attribute',
					condition: 'isWhiteSpace',
				},
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
