import { h } from 'hine';
import { PText } from '../nodes';

/**
 * @param {import('../types').ParserContext} context
 */
export function createTextState(context) {
	/** @type {PText} */
	let text;
	return h.atomic({
		actions: {
			addChar: h.action({
				run(value) {
					text.raw += value;
					text.end = context.index;
				},
			}),
			initialize: h.action({
				run() {
					text = new PText();
					text.end = context.index;
					text.start = context.index;
					context.stack.push(text);
				},
			}),
			finalize: h.action({
				run() {
					const popped = context.stack.pop();
					if (!Object.is(popped, text)) {
						throw Error(`Expected to find Text node on stack. Found '${popped.type}' instead.`);
					}
					text.end = context.index;
					const parent = context.stack.peek({ expect: ['Fragment']});
					parent.append(text);
					parent.end = context.index;
				},
			}),
		},
		entry: [{
			actions: ['initialize'],
		}],
		exit: [{
			actions: ['finalize'],
		}],
		on: {
			CHARACTER: [{
				actions: [
					'addChar',
					'increment',
				],
			}],
			EOF: [{
				transitionTo: 'eof',
			}],
			RESET: [{
				transitionTo: 'start',
			}],
		},
	});
}
