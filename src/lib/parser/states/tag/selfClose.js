import { h } from 'hine';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createSelfCloseState(context) {
	return h.atomic({
		actions: {
			finalizeElement: h.action(() => {
				const element = context.stack.pop({ expect: ['Element']});
				element.end = context.index + 1;
				const elementParent = context.stack.peek({ expect: ['BlockStatement', 'Fragment']});
				elementParent.append(element);
				elementParent.end = context.index + 1;
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
