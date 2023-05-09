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
		},
		entry: [{
			actions: ['initialize'],
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
