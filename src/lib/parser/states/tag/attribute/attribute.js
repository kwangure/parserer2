import { createBeforeState } from './name/before.js';
import { createEqualsState } from './equals/equals.js';
import { createNameState } from './name/name.js';
import { createValueState } from './value/value.js';
import { h } from 'hine';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createAttributeState(context) {
	return h.compound({
		always: [
			{
				transitionTo: 'selfClose',
				condition: 'isForwardSlash',
				actions: ['finalize'],
			},
		],
		actions: {
			finalize: h.action(() => {
				const attribute = context.stack.pop({ expect: ['Attribute']});
				const element = context.stack.peek({ expect: ['Element']});
				element.append(attribute);
				element.end = context.index + 1;
			}),
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
