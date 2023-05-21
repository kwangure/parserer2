import { createBeforeState } from './name/before.js';
import { createEqualsState } from './equals.js';
import { createNameState } from './name/name.js';
import { createValueState } from './value/value.js';
import { h } from 'hine';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createAttributeState(context) {
	return h.compound({
		actions: {
			finalizeAttribute: h.action({
				run() {
					const attribute = context.stack.pop({ expect: ['Attribute']});
					const element = context.stack.peek({ expect: ['Element']});
					element.append(attribute);
					element.end = context.index + 1;
				},
			}),
		},
		conditions: {
			isDone: h.condition({
				run() {
					return Boolean(this.ownerState?.matches('attribute.done'));
				},
			}),
			isDoubleQuote: h.condition((value) => value === '"'),
			isSingleQuote: h.condition((value) => value === '\''),
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
				{
					transitionTo: 'attribute',
					condition: 'isDone',
				},
			],
		},
		states: {
			before: createBeforeState(),
			name: createNameState(context),
			equals: createEqualsState(),
			value: createValueState(context),
			done: h.atomic(),
		},
	});
}
