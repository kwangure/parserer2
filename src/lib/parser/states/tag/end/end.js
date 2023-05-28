import { createBeforeState } from './before.js';
import { createNameState } from './name.js';
import { h } from 'hine';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createEndState(context) {
	return h.compound({
		actions: {
			finalizeElement: h.action(() => {
				const closingTag = context.stack.pop({ expect: ['Element']});
				const openingTag = context.stack.pop({ expect: ['Element']});
				openingTag.end = context.index + 1;

				if (closingTag.name !== openingTag.name) {
					throw Error(`Expected closing tag name '${closingTag.name}' to match opening tag name '${openingTag.name}'`);
				}

				const fragmentOrElement = context.stack.peek({ expect: ['BlockStatement', 'Fragment', 'Element']});
				fragmentOrElement.append(openingTag);
				fragmentOrElement.end = context.index + 1;
			}),
		},
		conditions: {
			isDone: h.condition(({ ownerState }) => Boolean(ownerState?.matches('end.done'))),
		},
		on: {
			CHARACTER: [
				{
					transitionTo: 'done',
					condition: 'isDone',
					actions: ['finalizeElement'],
				},
			],
		},
		states: {
			before: createBeforeState(),
			name: createNameState(),
			done: h.atomic(),
		},
	});
}
