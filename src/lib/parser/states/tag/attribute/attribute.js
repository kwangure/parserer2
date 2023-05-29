import { createBeforeState } from './name/before.js';
import { createEqualsState } from './equals.js';
import { createNameState } from './name/name.js';
import { createShorthandState } from './shorthand.js';
import { createValueState } from './value/value.js';
import { h } from 'hine';
import { PAttribute } from '$lib/parser/nodes';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createAttributeState(context) {
	/** @type {PAttribute} */
	let attribute;
	return h.compound({
		actions: {
			addAttributeName: h.action({
				run({ value }) {
					attribute.name += value;
					attribute.end = context.index + 1;
				},
			}),
			finalizeAttribute: h.action({
				run() {
					const attribute = context.stack.pop({ expect: ['Attribute']});
					const element = context.stack.peek({ expect: ['Element']});
					element.append(attribute);
					element.end = context.index + 1;
				},
			}),
			initializeAttribute: h.action({
				run() {
					attribute = new PAttribute();
					attribute.start = context.index;
					context.stack.push(attribute);
				},
			}),
			resetAttribute: h.action({
				run() {
					attribute.clear();
					// We know it's not undefined in all other places since `initialize`
					// runs first. Set to `undefined` so that GC can cleanup.
					// @ts-expect-error
					attribute = undefined;
				},
			}),
		},
		conditions: {
			isDoubleQuote: h.condition(({ value }) => value === '"'),
			isEquals: h.condition(({ value }) => value === '='),
			isSingleQuote: h.condition(({ value }) => value === '\''),
		},
		on: {
			CHARACTER: [
				{
					transitionTo: 'selfClose',
					condition: 'isForwardSlash',
				},
				{
					transitionTo: 'done',
					condition: 'isTagClose',
				},
			],
		},
		states: {
			before: createBeforeState(),
			name: createNameState(),
			equals: createEqualsState(),
			shorthand: createShorthandState(context),
			value: createValueState(context),
			done: h.atomic(),
		},
	});
}
