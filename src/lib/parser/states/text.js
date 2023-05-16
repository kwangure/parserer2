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
				run(value) {
					text.raw += value;
					text.end = context.index;
				},
			}),
			initialize: h.action({
				run(value) {
					text = new PText();
					text.start = context.index;
					this.ownerState?.actions.addChar.run(value);
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
		on: {
			CHARACTER: [
				{
					transitionTo: 'tag',
					condition: 'isTagOpen',
					actions: ['finalize'],
				},
				{
					actions: ['addChar'],
				},
			],
			EOF: [{
				transitionTo: 'eof',
				actions: ['finalize'],
			}],
			RESET: [{
				transitionTo: 'start',
				actions: ['finalize'],
			}],
		},
	});
}
