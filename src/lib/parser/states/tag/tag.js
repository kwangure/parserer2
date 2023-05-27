import { createAttributeState } from './attribute/attribute.js';
import { createEndState } from './end/end.js';
import { createNameState } from './name.js';
import { createOpenState } from './open.js';
import { createSelfCloseState } from './selfClose.js';
import { h } from 'hine';

const ALPHA_CHARACTER = /[A-z]/;

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createTagState(context) {
	/**
	 * @type {import('$lib/parser/nodes').PElement}
	 */
	let element;
	return h.compound({
		actions: {
			addElementName: h.action({
				/** @param {string} value */
				run(value) {
					element.name += value;
					element.end = context.index + 1;
				},
			}),
			initializeElement: h.action({
				run() {
					element = context.stack.peek({ expect: ['Element']});
				},
			}),
		},
		always: [{
			transitionTo: 'fragment',
			condition: 'isDone',
		}],
		conditions: {
			isAlphaCharacter: h.condition((value) => ALPHA_CHARACTER.test(value)),
			isDone: h.condition({
				run() {
					return Boolean(this.ownerState?.matches('tag.done'));
				},
			}),
			isForwardSlash: h.condition((value) => value === '/'),
			isWhiteSpace: h.condition((value) => value === ' '),
		},
		states: {
			open: createOpenState(context),
			attribute: createAttributeState(context),
			end: createEndState(context),
			name: createNameState(),
			selfClose: createSelfCloseState(context),
			done: h.atomic(),
		},
		on: {
			RESET: [{
				transitionTo: 'start',
			}],
		},
	});
}
