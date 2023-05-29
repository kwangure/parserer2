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
	let text;
	return h.compound({
		actions: {
			addChar: h.action({
				run({ value }) {
					text.raw += value;
					text.end = context.index + 1;
				},
			}),
			initializeTextValue: h.action({
				run() {
					text = new PText();
					text.start = context.index;
					text.end = context.index + 1;
					context.stack.push(text);
				},
			}),
			finalizeQuotedValue: h.action(() => {
				const value = context.stack.pop({ expect: ['Text']});
				const attribute = context.stack.peek({ expect: ['Attribute']});
				attribute.append(value);
				value.end = context.index + 1;
				attribute.end = context.index + 1;
			}),
			finalizeUnquotedValue: h.action(() => {
				const value = context.stack.pop({ expect: ['Text']});
				const attribute = context.stack.peek({ expect: ['Attribute']});
				attribute.append(value);
				attribute.end = context.index;
			}),
			resetText: h.action({
				run() {
					text.clear();
					// We know it's not undefined in all other places since `initialize`
					// runs first. Set to `undefined` so that GC can cleanup.
					// @ts-expect-error
					text = undefined;
				},
			}),
		},
		conditions: {
			isDone: h.condition(({ ownerState }) => Boolean(ownerState?.matches('value.done'))),
		},
		on: {
			CHARACTER: [{
				transitionTo: 'before',
				condition: 'isDone',
			}],
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
