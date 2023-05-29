import { h } from 'hine';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createBeforeState(context) {
	return h.atomic({
		actions: {
			finalizeBlockStatement: h.action(() => {
				const blockStatement = context.stack.pop({ expect: ['BlockStatement']});
				const block = context.stack.peek({ expect: ['Block']});
				block.append(blockStatement);
				block.end = context.index + 1;
			}),
		},
		on: {
			CHARACTER: [
				{
					transitionTo: 'block',
					condition: 'isHashTag',
				},
				{
					transitionTo: 'block',
					condition: 'isForwardSlash',
					actions: ['finalizeBlockStatement'],
				},
				{
					transitionTo: 'block',
					condition: 'isColon',
					actions: ['finalizeBlockStatement'],
				},
				{
					transitionTo: 'raw',
				},
			],
		},
	});
}
