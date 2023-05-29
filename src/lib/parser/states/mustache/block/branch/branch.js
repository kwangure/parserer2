import { createBeforeState } from './before.js';
import { createNameState } from './name.js';
import { h } from 'hine';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createBranchState(context) {
	return h.compound({
		actions: {
			finalizeBlockStatement: h.action(() => {
				const closingTag = context.stack.pop({ expect: ['BlockStatement']});
				const parentBlock = context.stack.peek({ expect: ['Block']});
				parentBlock.append(closingTag);

				parentBlock.end = context.index + 1;
				closingTag.end = context.index + 1;
			}),
		},
		conditions: {
			isDone: h.condition(({ ownerState }) => Boolean(ownerState?.matches('branch.done'))),
		},
		on: {
			CHARACTER: [{
				transitionTo: 'done',
				condition: 'isDone',
			}],
		},
		states: {
			before: createBeforeState(),
			name: createNameState(),
			done: h.atomic(),
		},
	});
}
