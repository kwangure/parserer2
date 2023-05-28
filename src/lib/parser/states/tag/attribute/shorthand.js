import { h } from 'hine';
import { PShorthand } from '$lib/parser/nodes';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createShorthandState(context) {
	/** @type {import('$lib/parser/nodes').PShorthand} */
	let value;
	let nestingLevel = 0;
	return h.atomic({
		actions: {
			addChar: h.action({
				run({ value: char }) {
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
			initializeShorthandValue: h.action({
				run() {
					value = new PShorthand();
					value.start = context.index;
					value.end = context.index + 1;
					context.stack.push(value);
				},
			}),
			finalizeShorthandValue: h.action(() => {
				const value = context.stack.pop({ expect: ['AttributeShorthand']});
				const attribute = context.stack.peek({ expect: ['Attribute']});
				attribute.append(value);
				value.end = context.index + 1;
				attribute.name = value.raw;
				attribute.end = context.index + 1;
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
				'initializeAttribute',
				'initializeShorthandValue',
				'incrementNesting',
			],
		}],
		conditions: {
			isMustacheDone: h.condition(() => nestingLevel === 0),
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
						'finalizeShorthandValue',
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
