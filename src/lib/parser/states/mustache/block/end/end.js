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
				context.stack.pop({ expect: ['Block']});
				const openingTag = context.stack.pop({ expect: ['BlockStatement']});
				openingTag.end = context.index + 1;

				if (closingTag.name !== openingTag.name) {
					throw Error(`Expected closing tag name '${closingTag.name}' to match opening tag name '${openingTag.name}'`);
				}

				const block = context.stack.peek({ expect: ['Block']});
				block.append(openingTag);
				block.end = context.index + 1;
			}),
		},
		conditions: {
			isDone: h.condition({
				run() {
					return Boolean(this.ownerState?.matches('end.done'));
				},
			}),
		},
		entry: [{
			actions: ['initializeBlockStatement'],
		}],
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
