import { h } from 'hine';
import { PAttribute } from '$lib/parser/nodes';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createNameState(context) {
	/**
	 * @type {import('$lib/parser/nodes').PAttribute}
	 */
	let attribute;
	return h.atomic({
		actions: {
			addName: h.action({
				/** @param {string} value */
				run(value) {
					attribute.name += value;
					attribute.end = context.index;
				},
			}),
			finalize: h.action(() => {
				const current = context.stack.pop({ expect: ['Attribute']});
				current.end = context.index + 1;
				const last = context.stack.peek({ expect: ['Element']});
				last.append(current);
				last.end = context.index + 1;
			}),
			initialize: h.action({
				run() {
					attribute = new PAttribute();
					attribute.start = context.index;
					context.stack.push(attribute);
				},
			}),
			reset: h.action({
				run() {
					attribute.clear();
					// We know it's not undefined in all other places since `initialize`
					// runs first. Set to `undefined` so that GC can cleanup.
					// @ts-expect-error
					attribute = undefined;
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
					transitionTo: 'done',
					condition: 'isForwardSlash',
					actions: ['finalize'],
				},
				{
					actions: ['addName'],
				},
			],

			RESET: [{
				actions: ['reset'],
			}],
		},
	});
}
