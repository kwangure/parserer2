import { h } from 'hine';
import { PMustache } from '$lib/parser/nodes';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createMustacheState(context) {
	/** @type {import('$lib/parser/nodes').PMustache} */
	let value;
	let nestingLevel = 0;
	return h.atomic({
		actions: {
			addChar: h.action({
				/** @param {string} char */
				run(char) {
					value.raw += char;
					value.end = context.index + 1;
				},
			}),
			decrementNesting: h.action(() => {
				nestingLevel -= 1;
			}),
			incrementNesting: h.action(() => {
				nestingLevel += 1;
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
			actions: [
				'initializeMustacheValue',
				'incrementNesting',
			],
		}],
		conditions: {
			isMustacheDone: h.condition({
				run() {
					return nestingLevel === 0;
				},
			}),
		},
		on: {
			CHARACTER: [
				{
					condition: 'isMustacheOpen',
					actions: ['incrementNesting'],
				},
				{
					condition: 'isMustacheClose',
					actions: ['decrementNesting'],
				},
				{
					transitionTo: 'done',
					condition: 'isMustacheDone',
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
