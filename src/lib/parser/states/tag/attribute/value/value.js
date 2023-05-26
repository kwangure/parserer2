import { createBeforeState } from './before.js';
import { createDoubleQuotedState } from './double_quoted.js';
import { createMustacheState } from './mustache.js';
import { createSingleQuotedState } from './single_quoted.js';
import { createUnquotedState } from './unquoted.js';
import { h } from 'hine';
import { PText } from '$lib/parser/nodes';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createValueState(context) {
	/** @type {import('$lib/parser/nodes').PText} */
	let value;
	return h.compound({
		actions: {
			addChar: h.action({
				/** @param {string} char */
				run(char) {
					value.raw += char;
					value.end = context.index + 1;
				},
			}),
			initializeQuotedValue: h.action({
				run() {
					value = new PText();
					value.start = context.index + 1;
					value.end = context.index + 1;
					context.stack.push(value);
				},
			}),
			initializeUnquotedValue: h.action({
				run() {
					value = new PText();
					value.start = context.index;
					value.end = context.index + 1;
					context.stack.push(value);
				},
			}),
			finalizeQuotedValue: h.action(() => {
				const value = context.stack.pop({ expect: ['Text']});
				const attribute = context.stack.peek({ expect: ['Attribute']});
				attribute.append(value);
				attribute.end = context.index + 1;
			}),
			finalizeUnquotedValue: h.action(() => {
				const value = context.stack.pop({ expect: ['Text']});
				const attribute = context.stack.peek({ expect: ['Attribute']});
				attribute.append(value);
				attribute.end = context.index;
			}),
			reset: h.action({
				run() {
					value.clear();
					// We know it's not undefined in all other places since `initialize`
					// runs first. Set to `undefined` so that GC can cleanup.
					// @ts-expect-error
					value = undefined;
				},
			}),
		},
		conditions: {
			isDone: h.condition({
				run() {
					return Boolean(this.ownerState?.matches('value.done'));
				},
			}),
		},
		on: {
			CHARACTER: [
				{
					// attribute.before
					transitionTo: 'before',
					condition: 'isDone',
				},
			],
		},
		states: {
			before: createBeforeState(),
			doubleQuoted: createDoubleQuotedState(),
			mustache: createMustacheState(context),
			singleQuoted: createSingleQuotedState(),
			unquoted: createUnquotedState(),
			done: h.atomic(),
		},
	});
}
