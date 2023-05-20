import { h } from 'hine';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createSelfCloseState(context) {
	return h.atomic({
		actions: {
			finalizeElement: h.action(() => {
				const current = context.stack.pop({ expect: ['Element']});
				current.end = context.index + 1;
				const last = context.stack.peek({ expect: ['Fragment']});
				last.append(current);
				last.end = context.index + 1;
			}),
		},
		conditions: {
			isTagClose: h.condition({
				/** @param {string} value */
				run: (value) => value === '>',
			}),
		},
		on: {
			CHARACTER: [
				{
					transitionTo: 'done',
					condition: 'isTagClose',
					actions: ['finalizeElement'],
				},
			],
		},
	});
}
