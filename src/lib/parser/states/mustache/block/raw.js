import { h } from 'hine';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createRawState(context) {
	/** @type {import('$lib/parser/nodes').PBlockStatement} */
	let blockStatement;
	let nestingLevel = 0;
	return h.atomic({
		actions: {
			addChar: h.action(({ value }) => {
				blockStatement.raw += value;
				blockStatement.end = context.index + 1;
			}),
			decrementNesting: h.action(() => nestingLevel -= 1),
			incrementNesting: h.action(() => nestingLevel += 1),
			initializeRaw: h.action(() => {
				blockStatement = context.stack.peek({ expect: ['BlockStatement']});
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
		entry: [{
			actions: [
				'initializeRaw',
				'incrementNesting',
			],
		}],
		conditions: {
			isMustacheDone: h.condition(() => nestingLevel === 0),
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
