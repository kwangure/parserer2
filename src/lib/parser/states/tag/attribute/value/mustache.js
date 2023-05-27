import { h } from 'hine';
import { PMustache } from '$lib/parser/nodes';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createMustacheState(context) {
	/** @type {import('$lib/parser/nodes').PMustache} */
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
			initializeMustacheValue: h.action({
				run() {
					value = new PMustache();
					value.start = context.index;
					value.end = context.index + 1;
					context.stack.push(value);
				},
			}),
			finalizeMustacheValue: h.action(() => {
				const value = context.stack.pop({ expect: ['Mustache']});
				const attribute = context.stack.peek({ expect: ['Attribute']});
				attribute.append(value);
				value.end = context.index + 1;
				attribute.end = context.index + 1;
			}),
		},
		entry: [{
			actions: ['initializeMustacheValue'],
		}],
		on: {
			CHARACTER: [
				{
					transitionTo: 'done',
					condition: 'isMustacheClose',
					actions: [
						'finalizeMustacheValue',
						'finalizeAttribute',
					],
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
