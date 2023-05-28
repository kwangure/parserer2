import { h } from 'hine';
import { PText } from '$lib/parser/nodes';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createTextState(context) {
	/** @type {PText} */
	let text;
	return h.atomic({
		actions: {
			addChar: h.action({
				/** @param {string} value */
				run(value) {
					text.raw += value;
					text.end = context.index + 1;
				},
			}),
			initialize: h.action({
				run() {
					text = new PText();
					text.start = context.index;
					context.stack.push(text);
				},
			}),
			finalizeText: h.action({
				run() {
					const popped = context.stack.pop();
					if (!Object.is(popped, text)) {
						throw Error(`Expected to find Text node on stack. Found '${popped.type}' instead.`);
					}
					text.end = context.index;
					const textParent = context.stack.peek({ expect: ['BlockStatement', 'Fragment', 'Element']});
					textParent.append(text);
					textParent.end = context.index;
				},
			}),
			reset: h.action({
				run() {
					text.clear();
					// We know it's not undefined in all other places since `initialize`
					// runs first. Set to `undefined` so that GC can cleanup.
					// @ts-ignore
					text = undefined;
				},
			}),
		},
		entry: [{
			actions: [
				'initialize',
				'addChar',
			],
		}],
		on: {
			CHARACTER: [
				{
					transitionTo: 'tag',
					condition: 'isTagOpen',
					actions: ['finalizeText'],
				},
				{
					transitionTo: 'mustache',
					condition: 'isMustacheOpen',
					actions: ['finalizeText'],
				},
				{
					actions: ['addChar'],
				},
			],
			EOF: [{
				transitionTo: 'eof',
				actions: ['finalizeText'],
			}],
			RESET: [{
				transitionTo: 'start',
				actions: ['reset'],
			}],
		},
	});
}
