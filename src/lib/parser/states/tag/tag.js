import { createAttributeState } from './attribute/attribute.js';
import { createNameState } from './name.js';
import { createOpenState } from './open.js';
import { createSelfCloseState } from './selfClose.js';
import { h } from 'hine';

/**
 * @param {import('$lib/parser/types').ParserContext} context
 */
export function createTagState(context) {
	return h.compound({
		always: [{
			transitionTo: 'fragment',
			condition: 'isDone',
		}],
		conditions: {
			isAlphaCharacter: h.condition({
				/** @param {string} value */
				run: (value) => (/[A-z]/).test(value),
			}),
			isDone: h.condition({
				run() {
					if (this.ownerState?.type !== 'compound') return false;
					return this.ownerState.state?.name === 'done';
				},
			}),
			isForwardSlash: h.condition({
				/** @param {string} value */
				run: (value) => value === '/',
			}),
			isWhiteSpace: h.condition({
				run(value) {
					return value === ' ';
				},
			}),
		},
		states: {
			open: createOpenState(context),
			attribute: createAttributeState(context),
			name: createNameState(context),
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
