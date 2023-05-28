import { PBlock, PBlockStatement } from '$lib/parser/nodes';
import { createEndState } from './end/end.js';
import { createNameState } from './name.js';
import { createRawState } from './raw.js';
import { h } from 'hine';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createBlockState(context) {
	/** @type {PBlock} */
	let block;
	/** @type {PBlockStatement} */
	let blockStatement;
	return h.compound({
		actions: {
			addBlockStatementName: h.action({
				run({ value }) {
					blockStatement.name += value;
					blockStatement.end = context.index + 1;
				},
			}),
			initializeBlock: h.action({
				run() {
					block = new PBlock();
					block.start = context.index - 1;
					block.end = context.index + 1;
					context.stack.push(block);
				},
			}),
			initializeBlockStatement: h.action({
				run() {
					blockStatement = new PBlockStatement();
					blockStatement.start = context.index - 1;
					blockStatement.end = context.index + 1;
					context.stack.push(blockStatement);
				},
			}),
			finalizeBlock: h.action(() => {
				const block = context.stack.pop({ expect: ['Block']});
				block.end = context.index + 1;

				const blockParent = context.stack.peek({ expect: ['BlockStatement', 'Fragment', 'Element']});
				blockParent.append(block);
				blockParent.end = context.index + 1;
			}),
			resetBlock: h.action({
				run() {
					block.clear();
					// We know it's not undefined in all other places since `initialize`
					// runs first. Set to `undefined` so that GC can cleanup.
					// @ts-expect-error
					block = undefined;
				},
			}),
			resetBlockStatement: h.action({
				run() {
					blockStatement.clear();
					// We know it's not undefined in all other places since `initialize`
					// runs first. Set to `undefined` so that GC can cleanup.
					// @ts-expect-error
					blockStatement = undefined;
				},
			}),
		},
		conditions: {
			isDone: h.condition(({ ownerState }) => Boolean(ownerState?.matches('block.done'))),
		},
		entry: [{
			actions: ['initializeBlock'],
		}],
		on: {
			CHARACTER: [{
				transitionTo: 'done',
				condition: 'isDone',
			}],
			RESET: [{
				actions: [
					'resetBlock',
					'resetBlockStatement',
				],
			}],
		},
		states: {
			start: h.atomic({
				always: [{
					transitionTo: 'name',
					condition: 'isHashTag',
				}, {
					transitionTo: 'end',
					condition: 'isForwardSlash',
				}],
			}),
			name: createNameState(),
			end: createEndState(context),
			raw: createRawState(context),
			done: h.atomic(),
		},
	});
}
