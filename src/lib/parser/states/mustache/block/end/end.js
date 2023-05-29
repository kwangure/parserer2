import { createBeforeState } from './before.js';
import { createNameState } from './name.js';
import { h } from 'hine';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createEndState(context) {
	return h.compound({
		actions: {
			finalizeBlockStatement: h.action(() => {
				const closingTag = context.stack.pop({ expect: ['BlockStatement']});
				const parentBlock = context.stack.peek({ expect: ['Block']});
				const openingTag = parentBlock.children[0];

				if (closingTag.name !== openingTag.name) {
					throw Error(`Expected closing tag name '${closingTag.name}' to match opening tag name '${openingTag.name}'`);
				}

				parentBlock.append(closingTag);
				parentBlock.end = context.index + 1;
			}),
		},
		conditions: {
			isDone: h.condition(({ ownerState }) => Boolean(ownerState?.matches('end.done'))),
		},
		on: {
			CHARACTER: [{
				transitionTo: 'done',
				condition: 'isDone',
				actions: [
					'finalizeBlockStatement',
					'finalizeBlock',
				],
			}],
		},
		states: {
			before: createBeforeState(),
			name: createNameState(),
			done: h.atomic(),
		},
	});
}
