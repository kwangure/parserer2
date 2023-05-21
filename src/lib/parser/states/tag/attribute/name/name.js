import { h } from 'hine';
import { PAttribute } from '$lib/parser/nodes';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createNameState(context) {
	/** @type {PAttribute} */
	let attribute;
	return h.atomic({
		actions: {
			addName: h.action({
				/** @param {string} value */
				run(value) {
					attribute.name += value;
					attribute.end = context.index + 1;
				},
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
					actions: ['finalizeAttribute'],
				},
				{
					transitionTo: 'done',
					condition: 'isTagClose',
					actions: ['finalizeAttribute'],
				},
				{
					transitionTo: 'equals',
					condition: 'isWhiteSpace',
				},
				{
					transitionTo: 'value',
					condition: 'isEquals',
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
