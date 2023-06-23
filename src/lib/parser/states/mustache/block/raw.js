import { h } from 'hine';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createRawState(context) {
	return h.atomic({
		conditions: {
			isMustacheDone: h.condition(() => context.nestingLevel === 0),
		},
		on: {
			CHARACTER: [
				{
					condition: 'isMustacheOpen',
					actions: ['incrementNesting'],
				},
				{
					condition: 'isMustacheClose',
					actions: ['decrementNesting'],
				},
				{
					transitionTo: 'done',
					condition: 'isMustacheDone',
					actions: ['addBlockStatementEnd'],
				},
				{
					actions: ['addChar'],
				},
			],
			RESET: [{
				actions: ['resetMustache'],
			}],
		},
	});
}

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createRawMonitor(context) {
	/** @type {import('$lib/parser/nodes').PBlockStatement} */
	let blockStatement;
	return {
		actions: {
			addChar: h.action(({ value }) => {
				blockStatement.raw += value;
				blockStatement.end = context.index + 1;
			}),
			decrementNesting: h.action(() => (context.nestingLevel -= 1)),
			incrementNesting: h.action(() => (context.nestingLevel += 1)),
			initializeRaw: h.action(() => {
				blockStatement = context.stack.peek({ expect: ['BlockStatement']});
				context.nestingLevel = 0;
			}),
			resetMustache: h.action({
				run() {
					blockStatement.clear();
					// We know it's not undefined in all other places since `initialize`
					// runs first. Set to `undefined` so that GC can cleanup.
					// @ts-expect-error
					blockStatement = undefined;
				},
			}),
		},
		entry: [
			{
				actions: ['initializeRaw', 'incrementNesting'],
			},
		],
	};
}
