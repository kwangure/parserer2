import { h } from 'hine';
import { PText } from '$lib/parser/nodes';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createTextState(context) {
	/** @type {import('$lib/parser/nodes').PText} */
	let value;
	return h.atomic({
		actions: {
			addChar: h.action({
				/** @param {string} char */
				run(char) {
					value.raw += char;
					value.end = context.index + 1;
				},
			}),
			initialize: h.action({
				run() {
					value = new PText();
					value.start = context.index;
					value.end = context.index + 1;
					context.stack.push(value);
				},
			}),
			finalize: h.action(() => {
				const value = context.stack.pop({ expect: ['Text']});
				const attribute = context.stack.peek({ expect: ['Attribute']});
				attribute.append(value);
				attribute.end = context.index;
			}),
			reset: h.action({
				run() {
					value.clear();
					// We know it's not undefined in all other places since `initialize`
					// runs first. Set to `undefined` so that GC can cleanup.
					// @ts-expect-error
					value = undefined;
				},
			}),
		},
		entry: [{
			actions: [
				'initialize',
				'addChar',
			],
		}],
		exit: [{
			actions: ['finalize'],
		}],
		on: {
			CHARACTER: [
				{
					transitionTo: 'done',
					condition: 'isForwardSlash',
				},
				{
					actions: ['addChar'],
				},
			],
			RESET: [{
				actions: ['reset'],
			}],
		},
	});
}
