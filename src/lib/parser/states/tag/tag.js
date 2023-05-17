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
		},
		states: {
			open: createOpenState(context),
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
